using ApexDigital.Application.DTOs;
using ApexDigital.Application.Services;
using ApexDigital.Domain.Entities;
using ApexDigital.Infrastructure.FileStorage;
using ApexDigital.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using MongoDB.Driver;

namespace ApexDigital.Api.Controllers;

[ApiController]
[Route("api/submissions")]
public class SubmissionsController : ControllerBase
{
    private readonly MongoDbContext _db;
    private readonly IFileStorageService _files;

    public SubmissionsController(MongoDbContext db, IFileStorageService files)
    {
        _db = db; _files = files;
    }

    /// <summary>POST /api/submissions/service-request — Submit service request with optional files</summary>
    [HttpPost("service-request")]
    [EnableRateLimiting("public-form")]
    [RequestSizeLimit(50 * 1024 * 1024)]
    [ApiExplorerSettings(IgnoreApi = true)]
    [ProducesResponseType(200)]
    [ProducesResponseType(typeof(ApiError), 400)]
    public async Task<IActionResult> CreateServiceRequest(
        [FromForm] CreateServiceRequestDto dto,
        [FromForm] List<IFormFile>? files)
    {
        if (!ModelState.IsValid) return BadRequest(new ApiError("Validation error", GetErrors()));

        var entity = new ServiceRequest
        {
            Name = dto.Name.Trim(),
            Company = dto.Company?.Trim(),
            Email = dto.Email?.Trim(),
            Phone = dto.Phone.Trim(),
            Service = dto.Service?.Trim(),
            Budget = dto.Budget?.Trim(),
            Timeline = dto.Timeline?.Trim(),
            Description = dto.Description?.Trim(),
        };

        // Process file uploads
        if (files != null)
        {
            foreach (var file in files.Take(5)) // max 5 files
            {
                if (!_files.ValidateFile(file.FileName, file.ContentType, file.Length, out var err))
                    return BadRequest(new ApiError(err));

                using var stream = file.OpenReadStream();
                var (storedName, _) = await _files.SaveAsync(stream, file.FileName, file.ContentType, "requests");
                entity.Attachments.Add(new AttachmentInfo
                {
                    Name = file.FileName,
                    Size = file.Length,
                    StoredFileName = storedName,
                    Url = $"/api/files/requests/{storedName}",
                });
            }
        }

        await _db.ServiceRequests.InsertOneAsync(entity);
        return Ok(new { message = "Заявка успешно отправлена", id = entity.Id });
    }

    /// <summary>POST /api/submissions/job-application — Submit job application with resume</summary>
    [HttpPost("job-application")]
    [EnableRateLimiting("public-form")]
    [RequestSizeLimit(25 * 1024 * 1024)]
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<IActionResult> CreateJobApplication(
        [FromForm] CreateJobApplicationDto dto,
        [FromForm] IFormFile? resume)
    {
        if (!ModelState.IsValid) return BadRequest(new ApiError("Validation error", GetErrors()));

        // Verify job exists
        var job = await _db.Jobs.Find(j => j.Id == dto.JobId).FirstOrDefaultAsync();
        if (job == null) return BadRequest(new ApiError("Вакансия не найдена"));

        var entity = new JobApplication
        {
            JobId = dto.JobId,
            JobTitle = job.Title.Ru, // store for quick access
            Name = dto.Name.Trim(),
            Email = dto.Email?.Trim(),
            Phone = dto.Phone?.Trim(),
            Links = dto.Links?.Trim(),
            Message = dto.Message?.Trim(),
        };

        // Process resume
        if (resume != null)
        {
            if (!_files.ValidateFile(resume.FileName, resume.ContentType, resume.Length, out var err))
                return BadRequest(new ApiError(err));

            using var stream = resume.OpenReadStream();
            var (storedName, _) = await _files.SaveAsync(stream, resume.FileName, resume.ContentType, "resumes");
            entity.ResumeFile = new ResumeFileInfo
            {
                Name = resume.FileName,
                Size = resume.Length,
                Type = resume.ContentType,
                StoredFileName = storedName,
                Url = $"/api/files/resumes/{storedName}",
            };
        }

        await _db.JobApplications.InsertOneAsync(entity);

        // Increment applicants counter on the job
        await _db.Jobs.UpdateOneAsync(j => j.Id == dto.JobId,
            Builders<Domain.Entities.JobVacancy>.Update.Inc(j => j.Applicants, 1));

        return Ok(new { message = "Заявка отправлена", id = entity.Id });
    }

    private Dictionary<string, string[]> GetErrors() =>
        ModelState.Where(m => m.Value?.Errors.Count > 0)
            .ToDictionary(m => m.Key, m => m.Value!.Errors.Select(e => e.ErrorMessage).ToArray());
}

