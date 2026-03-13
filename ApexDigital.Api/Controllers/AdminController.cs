using System.Security.Claims;
using ApexDigital.Application.DTOs;
using ApexDigital.Application.Services;
using ApexDigital.Domain.Entities;
using ApexDigital.Infrastructure.FileStorage;
using ApexDigital.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace ApexDigital.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize]
public class AdminController : ControllerBase
{
    private readonly MongoDbContext _db;
    private readonly IFileStorageService _files;
    private readonly IAuditService _audit;

    public AdminController(MongoDbContext db, IFileStorageService files, IAuditService audit)
    {
        _db = db;
        _files = files;
        _audit = audit;
    }
    
    private static string? TryGetStoredProjectFileName(string? url)
    {
        if (string.IsNullOrWhiteSpace(url)) return null;

        const string marker = "/api/files/projects/";
        var index = url.IndexOf(marker, StringComparison.OrdinalIgnoreCase);
        if (index >= 0)
            return Path.GetFileName(url[(index + marker.Length)..]);

        return null;
    }

    private string AdminLogin => User.FindFirstValue(ClaimTypes.Name) ?? "unknown";
    private string BaseUrl => $"{Request.Scheme}://{Request.Host}";

    // ========== DASHBOARD ==========

    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        var totalSR = await _db.ServiceRequests.CountDocumentsAsync(_ => true);
        var newSR = await _db.ServiceRequests.CountDocumentsAsync(s => s.Status == "new");
        var publishedJobs = await _db.Jobs.CountDocumentsAsync(j => j.Status == "published");
        var totalApps = await _db.JobApplications.CountDocumentsAsync(_ => true);
        var newApps = await _db.JobApplications.CountDocumentsAsync(a => a.Status == "new");
        var totalProjects = await _db.Projects.CountDocumentsAsync(_ => true);

        var recentSR = await _db.ServiceRequests.Find(_ => true)
            .SortByDescending(s => s.CreatedAt).Limit(5).ToListAsync();
        var recentApps = await _db.JobApplications.Find(_ => true)
            .SortByDescending(a => a.CreatedAt).Limit(5).ToListAsync();

        return Ok(new DashboardMetrics
        {
            TotalServiceRequests = (int)totalSR,
            NewServiceRequests = (int)newSR,
            PublishedJobs = (int)publishedJobs,
            TotalApplicants = (int)totalApps,
            NewApplicants = (int)newApps,
            TotalProjects = (int)totalProjects,
            RecentRequests = recentSR.Select(s => s.ToDto(BaseUrl)).ToList(),
            RecentApplications = recentApps.Select(a => a.ToDto(BaseUrl)).ToList(),
        });
    }

    // ========== SERVICE REQUESTS ==========

    [HttpGet("service-requests")]
    public async Task<IActionResult> GetServiceRequests(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? status = null)
    {
        var filter = Builders<ServiceRequest>.Filter.Empty;
        if (!string.IsNullOrEmpty(status))
            filter = Builders<ServiceRequest>.Filter.Eq(s => s.Status, status);

        var total = await _db.ServiceRequests.CountDocumentsAsync(filter);
        var items = await _db.ServiceRequests.Find(filter)
            .SortByDescending(s => s.CreatedAt)
            .Skip((page - 1) * pageSize).Limit(pageSize).ToListAsync();

        return Ok(new PaginatedResult<ServiceRequestDto>(
            items.Select(s => s.ToDto(BaseUrl)).ToList(), (int)total, page, pageSize));
    }

    [HttpPatch("service-requests/{id}/status")]
    public async Task<IActionResult> UpdateServiceRequestStatus(string id, [FromBody] UpdateServiceRequestStatusDto dto)
    {
        var update = Builders<ServiceRequest>.Update
            .Set(s => s.Status, dto.Status)
            .Set(s => s.Processed, dto.Status == "processed")
            .Set(s => s.UpdatedAt, DateTime.UtcNow);
        if (dto.AdminNote != null)
            update = update.Set(s => s.AdminNote, dto.AdminNote);

        var result = await _db.ServiceRequests.UpdateOneAsync(s => s.Id == id, update);
        if (result.MatchedCount == 0) return NotFound(new ApiError("Заявка не найдена"));

        await _audit.LogAsync("update_status", "ServiceRequest", id, AdminLogin, $"Status → {dto.Status}");
        return Ok(new { message = "Статус обновлён" });
    }

    [HttpDelete("service-requests/{id}")]
    public async Task<IActionResult> DeleteServiceRequest(string id)
    {
        var existing = await _db.ServiceRequests.Find(s => s.Id == id).FirstOrDefaultAsync();
        if (existing == null) return NotFound(new ApiError("Service request not found"));

        foreach (var attachment in existing.Attachments)
        {
            if (!string.IsNullOrWhiteSpace(attachment.StoredFileName))
                await _files.DeleteAsync(attachment.StoredFileName, "requests");
        }

        var result = await _db.ServiceRequests.DeleteOneAsync(s => s.Id == id);
        if (result.DeletedCount == 0) return NotFound(new ApiError("Service request not found"));

        await _audit.LogAsync("delete", "ServiceRequest", id, AdminLogin);
        return Ok(new { message = "Deleted" });
    }

    [HttpGet("settings")]
    public async Task<IActionResult> GetSettings()
    {
        var settings = await _db.SiteSettings.Find(_ => true).FirstOrDefaultAsync();
        return Ok((settings ?? new SiteSettings()).ToDto());
    }

    [HttpPut("settings")]
    public async Task<IActionResult> UpdateSettings([FromBody] SiteSettingsDto dto)
    {
        var settings = await _db.SiteSettings.Find(_ => true).FirstOrDefaultAsync() ?? new SiteSettings();

        settings.Phone = dto.Phone.Trim();
        settings.Email = dto.Email.Trim();
        settings.Address = dto.Address.ToEntity();
        settings.Instagram = string.IsNullOrWhiteSpace(dto.Instagram) ? null : dto.Instagram.Trim();
        settings.Linkedin = string.IsNullOrWhiteSpace(dto.Linkedin) ? null : dto.Linkedin.Trim();
        settings.Telegram = string.IsNullOrWhiteSpace(dto.Telegram) ? null : dto.Telegram.Trim();
        settings.Whatsapp = string.IsNullOrWhiteSpace(dto.Whatsapp) ? null : dto.Whatsapp.Trim();
        settings.UpdatedAt = DateTime.UtcNow;

        if (string.IsNullOrWhiteSpace(settings.Id))
            await _db.SiteSettings.InsertOneAsync(settings);
        else
            await _db.SiteSettings.ReplaceOneAsync(s => s.Id == settings.Id, settings);

        await _audit.LogAsync("update", "SiteSettings", settings.Id, AdminLogin);
        return Ok(settings.ToDto());
    }

    // ========== PROJECTS ==========

    [HttpGet("projects")]
    public async Task<IActionResult> GetAllProjects([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        var total = await _db.Projects.CountDocumentsAsync(_ => true);
        var items = await _db.Projects.Find(_ => true)
            .SortByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize).Limit(pageSize).ToListAsync();

        return Ok(new PaginatedResult<ProjectDto>(items.Select(p => p.ToDto()).ToList(), (int)total, page, pageSize));
    }

    [HttpPost("projects")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(25 * 1024 * 1024)]
    public async Task<IActionResult> CreateProject([FromForm] CreateProjectForm form)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        if (string.IsNullOrWhiteSpace(form.TitleRu) || string.IsNullOrWhiteSpace(form.DescriptionRu) ||
            string.IsNullOrWhiteSpace(form.Category))
            return BadRequest(new ApiError("Заполните обязательные поля проекта"));

        string imageUrl = "";

        if (form.Image != null && form.Image.Length > 0)
        {
            if (!_files.ValidateFile(form.Image.FileName, form.Image.ContentType, form.Image.Length, out var err))
                return BadRequest(new ApiError(err));

            using var stream = form.Image.OpenReadStream();
            var (storedName, _) =
                await _files.SaveAsync(stream, form.Image.FileName, form.Image.ContentType, "projects");
            imageUrl = $"/api/files/projects/{storedName}";
        }

        var titleEnForSlug = string.IsNullOrWhiteSpace(form.TitleEn) ? form.TitleRu : form.TitleEn;
        var slug = GenerateSlug(titleEnForSlug);

        var existing = await _db.Projects.Find(p => p.Slug == slug).FirstOrDefaultAsync();
        if (existing != null)
            slug += "-" + DateTime.UtcNow.Ticks.ToString()[^4..];

        var tags = string.IsNullOrWhiteSpace(form.Tags)
            ? new List<string>()
            : form.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();

        var entity = new Project
        {
            Slug = slug,
            Title = new LocalizedString
            {
                Ru = form.TitleRu.Trim(),
                Kz = string.IsNullOrWhiteSpace(form.TitleKz) ? form.TitleRu.Trim() : form.TitleKz.Trim(),
                En = string.IsNullOrWhiteSpace(form.TitleEn) ? form.TitleRu.Trim() : form.TitleEn.Trim(),
            },
            Description = new LocalizedString
            {
                Ru = form.DescriptionRu.Trim(),
                Kz = string.IsNullOrWhiteSpace(form.DescriptionKz)
                    ? form.DescriptionRu.Trim()
                    : form.DescriptionKz.Trim(),
                En = string.IsNullOrWhiteSpace(form.DescriptionEn)
                    ? form.DescriptionRu.Trim()
                    : form.DescriptionEn.Trim(),
            },
            Category = form.Category.Trim(),
            Status = string.IsNullOrWhiteSpace(form.Status) ? "progress" : form.Status.Trim(),
            Tags = tags,
            Stack = tags,
            Image = imageUrl,
            Gallery = new List<string>(),
            IsVisible = form.IsVisible,
        };

        await _db.Projects.InsertOneAsync(entity);
        await _audit.LogAsync("create", "Project", entity.Id, AdminLogin);
        return Ok(entity.ToDto());
    }

    [HttpPut("projects/{id}")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(25 * 1024 * 1024)]
    public async Task<IActionResult> UpdateProject(string id, [FromForm] CreateProjectForm form)
    {
        var existing = await _db.Projects.Find(p => p.Id == id).FirstOrDefaultAsync();
        if (existing == null) return NotFound(new ApiError("Проект не найден"));

        if (string.IsNullOrWhiteSpace(form.TitleRu) || string.IsNullOrWhiteSpace(form.DescriptionRu) ||
            string.IsNullOrWhiteSpace(form.Category))
            return BadRequest(new ApiError("Заполните обязательные поля проекта"));

        existing.Title = new LocalizedString
        {
            Ru = form.TitleRu.Trim(),
            Kz = string.IsNullOrWhiteSpace(form.TitleKz) ? form.TitleRu.Trim() : form.TitleKz.Trim(),
            En = string.IsNullOrWhiteSpace(form.TitleEn) ? form.TitleRu.Trim() : form.TitleEn.Trim(),
        };

        existing.Description = new LocalizedString
        {
            Ru = form.DescriptionRu.Trim(),
            Kz = string.IsNullOrWhiteSpace(form.DescriptionKz) ? form.DescriptionRu.Trim() : form.DescriptionKz.Trim(),
            En = string.IsNullOrWhiteSpace(form.DescriptionEn) ? form.DescriptionRu.Trim() : form.DescriptionEn.Trim(),
        };

        existing.Category = form.Category.Trim();
        existing.Status = string.IsNullOrWhiteSpace(form.Status) ? existing.Status : form.Status.Trim();
        existing.Tags = string.IsNullOrWhiteSpace(form.Tags)
            ? new List<string>()
            : form.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();
        existing.Stack = existing.Tags;
        existing.IsVisible = form.IsVisible;
        existing.UpdatedAt = DateTime.UtcNow;

        if (form.Image != null && form.Image.Length > 0)
        {
            if (!_files.ValidateFile(form.Image.FileName, form.Image.ContentType, form.Image.Length, out var err))
                return BadRequest(new ApiError(err));

            var oldStoredName = TryGetStoredProjectFileName(existing.Image);
            if (!string.IsNullOrWhiteSpace(oldStoredName))
                await _files.DeleteAsync(oldStoredName, "projects");

            using var stream = form.Image.OpenReadStream();
            var (storedName, _) =
                await _files.SaveAsync(stream, form.Image.FileName, form.Image.ContentType, "projects");
            existing.Image = $"/api/files/projects/{storedName}";
        }

        await _db.Projects.ReplaceOneAsync(p => p.Id == id, existing);
        await _audit.LogAsync("update", "Project", id, AdminLogin);
        return Ok(existing.ToDto());
    }

    [HttpPatch("projects/{id}/visibility")]
    public async Task<IActionResult> ToggleProjectVisibility(string id)
    {
        var project = await _db.Projects.Find(p => p.Id == id).FirstOrDefaultAsync();
        if (project == null) return NotFound(new ApiError("Проект не найден"));

        var newVisibility = !project.IsVisible;
        await _db.Projects.UpdateOneAsync(p => p.Id == id,
            Builders<Project>.Update.Set(p => p.IsVisible, newVisibility).Set(p => p.UpdatedAt, DateTime.UtcNow));

        await _audit.LogAsync("toggle_visibility", "Project", id, AdminLogin, $"Visible: {newVisibility}");
        return Ok(new { isVisible = newVisibility });
    }

    [HttpDelete("projects/{id}")]
    public async Task<IActionResult> DeleteProject(string id)
    {
        var existing = await _db.Projects.Find(p => p.Id == id).FirstOrDefaultAsync();
        if (existing == null) return NotFound(new ApiError("Проект не найден"));

        var storedName = TryGetStoredProjectFileName(existing.Image);
        if (!string.IsNullOrWhiteSpace(storedName))
            await _files.DeleteAsync(storedName, "projects");

        var result = await _db.Projects.DeleteOneAsync(p => p.Id == id);
        if (result.DeletedCount == 0) return NotFound(new ApiError("Проект не найден"));

        await _audit.LogAsync("delete", "Project", id, AdminLogin);
        return Ok(new { message = "Удалено" });
    }

    // ========== JOBS ==========

    [HttpGet("jobs")]
    public async Task<IActionResult> GetAllJobs([FromQuery] int page = 1, [FromQuery] int pageSize = 50, [FromQuery] string? status = null)
    {
        var filter = Builders<JobVacancy>.Filter.Empty;
        if (!string.IsNullOrEmpty(status))
            filter = Builders<JobVacancy>.Filter.Eq(j => j.Status, status);

        var total = await _db.Jobs.CountDocumentsAsync(filter);
        var items = await _db.Jobs.Find(filter)
            .SortByDescending(j => j.CreatedAt)
            .Skip((page - 1) * pageSize).Limit(pageSize).ToListAsync();

        return Ok(new PaginatedResult<JobDto>(items.Select(j => j.ToDto()).ToList(), (int)total, page, pageSize));
    }

    [HttpGet("jobs/{id}")]
    public async Task<IActionResult> GetJob(string id)
    {
        var job = await _db.Jobs.Find(j => j.Id == id).FirstOrDefaultAsync();
        if (job == null) return NotFound(new ApiError("Вакансия не найдена"));
        return Ok(job.ToDto());
    }

    [HttpPost("jobs")]
    public async Task<IActionResult> CreateJob([FromBody] CreateJobDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(new ApiError("Validation error"));

        var existing = await _db.Jobs.Find(j => j.Slug == dto.Slug).FirstOrDefaultAsync();
        if (existing != null) return BadRequest(new ApiError($"Slug '{dto.Slug}' уже используется"));

        var entity = new JobVacancy
        {
            Slug = dto.Slug,
            Title = dto.Title.ToEntity(), ShortDescription = dto.ShortDescription.ToEntity(),
            Requirements = dto.Requirements.Select(r => r.ToEntity()).ToList(),
            PostedDate = string.IsNullOrEmpty(dto.PostedDate) ? DateTime.UtcNow.ToString("yyyy-MM-dd") : dto.PostedDate,
            Department = dto.Department, Location = dto.Location,
            EmploymentType = dto.EmploymentType, Status = dto.Status, IsVisible = dto.IsVisible,
            Description = new JobDescriptionLocalized
            {
                Ru = dto.Description.Ru.ToEntity(),
                Kz = dto.Description.Kz.ToEntity(),
                En = dto.Description.En.ToEntity(),
            },
            Stack = dto.Stack,
            PublishedAt = dto.Status == "published" ? DateTime.UtcNow.ToString("o") : null,
        };

        await _db.Jobs.InsertOneAsync(entity);
        await _audit.LogAsync("create", "Job", entity.Id, AdminLogin);
        return Ok(entity.ToDto());
    }

    [HttpPut("jobs/{id}")]
    public async Task<IActionResult> UpdateJob(string id, [FromBody] CreateJobDto dto)
    {
        var existing = await _db.Jobs.Find(j => j.Id == id).FirstOrDefaultAsync();
        if (existing == null) return NotFound(new ApiError("Вакансия не найдена"));

        existing.Title = dto.Title.ToEntity();
        existing.ShortDescription = dto.ShortDescription.ToEntity();
        existing.Requirements = dto.Requirements.Select(r => r.ToEntity()).ToList();
        existing.PostedDate = dto.PostedDate;
        existing.Department = dto.Department;
        existing.Location = dto.Location;
        existing.EmploymentType = dto.EmploymentType;
        existing.IsVisible = dto.IsVisible;
        existing.Description = new JobDescriptionLocalized
        {
            Ru = dto.Description.Ru.ToEntity(),
            Kz = dto.Description.Kz.ToEntity(),
            En = dto.Description.En.ToEntity(),
        };
        existing.Stack = dto.Stack;
        existing.UpdatedAt = DateTime.UtcNow;

        // If status changed to published, set publishedAt
        if (dto.Status == "published" && existing.Status != "published")
            existing.PublishedAt = DateTime.UtcNow.ToString("o");
        existing.Status = dto.Status;

        await _db.Jobs.ReplaceOneAsync(j => j.Id == id, existing);
        await _audit.LogAsync("update", "Job", id, AdminLogin);
        return Ok(existing.ToDto());
    }

    [HttpDelete("jobs/{id}")]
    public async Task<IActionResult> DeleteJob(string id)
    {
        var result = await _db.Jobs.DeleteOneAsync(j => j.Id == id);
        if (result.DeletedCount == 0) return NotFound(new ApiError("Вакансия не найдена"));
        await _audit.LogAsync("delete", "Job", id, AdminLogin);
        return Ok(new { message = "Удалено" });
    }

    // ========== APPLICANTS ==========

    [HttpGet("applicants")]
    public async Task<IActionResult> GetApplicants(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20,
        [FromQuery] string? jobId = null, [FromQuery] string? status = null)
    {
        var filter = Builders<JobApplication>.Filter.Empty;
        if (!string.IsNullOrEmpty(jobId))
            filter &= Builders<JobApplication>.Filter.Eq(a => a.JobId, jobId);
        if (!string.IsNullOrEmpty(status))
            filter &= Builders<JobApplication>.Filter.Eq(a => a.Status, status);

        var total = await _db.JobApplications.CountDocumentsAsync(filter);
        var items = await _db.JobApplications.Find(filter)
            .SortByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize).Limit(pageSize).ToListAsync();

        return Ok(new PaginatedResult<JobApplicationDto>(
            items.Select(a => a.ToDto(BaseUrl)).ToList(), (int)total, page, pageSize));
    }

    [HttpPatch("applicants/{id}/status")]
    public async Task<IActionResult> UpdateApplicantStatus(string id, [FromBody] UpdateApplicantStatusDto dto)
    {
        var update = Builders<JobApplication>.Update
            .Set(a => a.Status, dto.Status);
        if (dto.Note != null)
            update = update.Set(a => a.Note, dto.Note);

        var result = await _db.JobApplications.UpdateOneAsync(a => a.Id == id, update);
        if (result.MatchedCount == 0) return NotFound(new ApiError("Заявка не найдена"));

        await _audit.LogAsync("update_status", "JobApplication", id, AdminLogin, $"Status → {dto.Status}");
        return Ok(new { message = "Статус обновлён" });
    }

    [HttpGet("applicants/{id}/resume")]
    public async Task<IActionResult> DownloadApplicantResume(string id)
    {
        var applicant = await _db.JobApplications.Find(a => a.Id == id).FirstOrDefaultAsync();
        if (applicant?.ResumeFile == null) return NotFound(new ApiError("Resume not found"));

        var storedFileName = applicant.ResumeFile.StoredFileName;
        if (string.IsNullOrWhiteSpace(storedFileName) && !string.IsNullOrWhiteSpace(applicant.ResumeFile.Url))
            storedFileName = System.IO.Path.GetFileName(applicant.ResumeFile.Url);

        if (string.IsNullOrWhiteSpace(storedFileName))
            return NotFound(new ApiError("Resume link not found"));

        var file = await _files.GetAsync(storedFileName, "resumes");
        if (file == null) return NotFound(new ApiError("Resume file not found"));

        var (stream, contentType) = file.Value;
        var downloadName = string.IsNullOrWhiteSpace(applicant.ResumeFile.Name) ? storedFileName : applicant.ResumeFile.Name;
        return File(stream, applicant.ResumeFile.Type ?? contentType, downloadName);
    }

    [HttpDelete("applicants/{id}")]
    public async Task<IActionResult> DeleteApplicant(string id)
    {
        var applicant = await _db.JobApplications.Find(a => a.Id == id).FirstOrDefaultAsync();
        if (applicant == null) return NotFound(new ApiError("Заявка не найдена"));

        if (!string.IsNullOrWhiteSpace(applicant.ResumeFile?.StoredFileName))
            await _files.DeleteAsync(applicant.ResumeFile.StoredFileName, "resumes");

        var result = await _db.JobApplications.DeleteOneAsync(a => a.Id == id);
        if (result.DeletedCount == 0) return NotFound(new ApiError("Заявка не найдена"));

        await _audit.LogAsync("delete", "JobApplication", id, AdminLogin);
        return Ok(new { message = "Удалено" });
    }

    // ========== HELPERS ==========

    private static string GenerateSlug(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return "project-" + Guid.NewGuid().ToString("N")[..8];
        return System.Text.RegularExpressions.Regex.Replace(
            text.ToLowerInvariant().Trim(), @"[^a-z0-9]+", "-").Trim('-');
    }
}



