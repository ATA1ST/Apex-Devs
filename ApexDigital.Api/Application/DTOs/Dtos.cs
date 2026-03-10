using System.ComponentModel.DataAnnotations;
using ApexDigital.Domain.Entities;

namespace ApexDigital.Application.DTOs;

// ========== AUTH ==========
public record LoginRequest
{
    [Required, StringLength(50)] public string Login { get; init; } = null!;
    [Required, StringLength(100)] public string Password { get; init; } = null!;
}

public record LoginResponse(string Token, int ExpiresIn, string DisplayName);
public record AuthStatusResponse(bool Authenticated, string? Login, string? DisplayName);

// ========== COMMON ==========
public record LocalizedStringDto
{
    public string Ru { get; init; } = "";
    public string Kz { get; init; } = "";
    public string En { get; init; } = "";
}

public record LocalizedStringArrayDto
{
    public List<string> Ru { get; init; } = new();
    public List<string> Kz { get; init; } = new();
    public List<string> En { get; init; } = new();
}

public record ApiError(string Message, Dictionary<string, string[]>? Errors = null);

public record PaginatedResult<T>(List<T> Items, int Total, int Page, int PageSize);

// ========== SERVICE REQUESTS ==========
public record CreateServiceRequestDto
{
    [Required, StringLength(200)] public string Name { get; init; } = null!;
    [StringLength(200)] public string? Company { get; init; }
    [EmailAddress, StringLength(200)] public string? Email { get; init; }
    [Required, StringLength(30)] public string Phone { get; init; } = null!;
    [StringLength(100)] public string? Service { get; init; }
    [StringLength(50)] public string? Budget { get; init; }
    [StringLength(50)] public string? Timeline { get; init; }
    [StringLength(2000)] public string? Description { get; init; }
}

public record ServiceRequestDto
{
    public string Id { get; init; } = "";
    public string Name { get; init; } = "";
    public string? Company { get; init; }
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public string? Service { get; init; }
    public string? Budget { get; init; }
    public string? Timeline { get; init; }
    public string? Description { get; init; }
    public List<AttachmentInfoDto> Attachments { get; init; } = new();
    public string Status { get; init; } = "new";
    public bool Processed { get; init; }
    public string? AdminNote { get; init; }
    public string CreatedAt { get; init; } = "";
}

public record AttachmentInfoDto(string Name, long Size, string Url);

public record UpdateServiceRequestStatusDto
{
    [Required] public string Status { get; init; } = null!;
    public string? AdminNote { get; init; }
}

// ========== PROJECTS ==========
public record ProjectDto
{
    public string Id { get; init; } = "";
    public string Slug { get; init; } = "";
    public LocalizedStringDto Title { get; init; } = new();
    public LocalizedStringDto Description { get; init; } = new();
    public LocalizedStringDto? FullDescription { get; init; }
    public LocalizedStringDto? Challenge { get; init; }
    public LocalizedStringDto? Solution { get; init; }
    public LocalizedStringArrayDto? Features { get; init; }
    public string Category { get; init; } = "web";
    public string Status { get; init; } = "progress";
    public List<string> Tags { get; init; } = new();
    public string Image { get; init; } = "";
    public List<string>? Gallery { get; init; }
    public LocalizedStringArrayDto? Goals { get; init; }
    public List<string>? Stack { get; init; }
    public LocalizedStringDto? Results { get; init; }
    public bool IsVisible { get; init; } = true;
    public LocalizedStringDto? Timeline { get; init; }
}

public record CreateProjectDto
{
    [Required] public LocalizedStringDto Title { get; init; } = new();
    [Required] public LocalizedStringDto Description { get; init; } = new();
    public LocalizedStringDto? FullDescription { get; init; }
    public LocalizedStringDto? Challenge { get; init; }
    public LocalizedStringDto? Solution { get; init; }
    public LocalizedStringArrayDto? Features { get; init; }
    [Required] public string Category { get; init; } = "web";
    [Required] public string Status { get; init; } = "progress";
    public List<string> Tags { get; init; } = new();
    public string Image { get; init; } = "";
    public List<string>? Gallery { get; init; }
    public List<string>? Stack { get; init; }
    public LocalizedStringDto? Results { get; init; }
    public bool IsVisible { get; init; } = true;
    public LocalizedStringDto? Timeline { get; init; }
}

// ========== JOBS ==========
public record JobDescriptionBlockDto
{
    public string Role { get; init; } = "";
    public List<string> Tasks { get; init; } = new();
    public List<string> Requirements { get; init; } = new();
    public List<string> PlusPoints { get; init; } = new();
    public List<string> Conditions { get; init; } = new();
}

public record JobDescriptionLocalizedDto
{
    public JobDescriptionBlockDto Ru { get; init; } = new();
    public JobDescriptionBlockDto Kz { get; init; } = new();
    public JobDescriptionBlockDto En { get; init; } = new();
}

public record JobDto
{
    public string Id { get; init; } = "";
    public string Slug { get; init; } = "";
    public LocalizedStringDto Title { get; init; } = new();
    public LocalizedStringDto ShortDescription { get; init; } = new();
    public List<LocalizedStringDto> Requirements { get; init; } = new();
    public string PostedDate { get; init; } = "";
    public string Department { get; init; } = "";
    public string Location { get; init; } = "";
    public string EmploymentType { get; init; } = "";
    public string Status { get; init; } = "";
    public bool IsVisible { get; init; }
    public JobDescriptionLocalizedDto Description { get; init; } = new();
    public List<string>? Stack { get; init; }
    public int Views { get; init; }
    public int Applicants { get; init; }
    public string? PublishedAt { get; init; }
    public string UpdatedAt { get; init; } = "";
}

public record CreateJobDto
{
    [Required] public string Slug { get; init; } = null!;
    [Required] public LocalizedStringDto Title { get; init; } = new();
    [Required] public LocalizedStringDto ShortDescription { get; init; } = new();
    public List<LocalizedStringDto> Requirements { get; init; } = new();
    public string PostedDate { get; init; } = "";
    [Required] public string Department { get; init; } = "dev";
    [Required] public string Location { get; init; } = "astana";
    [Required] public string EmploymentType { get; init; } = "full-time";
    [Required] public string Status { get; init; } = "draft";
    public bool IsVisible { get; init; } = true;
    [Required] public JobDescriptionLocalizedDto Description { get; init; } = new();
    public List<string>? Stack { get; init; }
}

// ========== JOB APPLICATIONS ==========
public record CreateJobApplicationDto
{
    [Required] public string JobId { get; init; } = null!;
    [Required, StringLength(200)] public string Name { get; init; } = null!;
    [StringLength(200)] public string? Email { get; init; }
    [StringLength(30)] public string? Phone { get; init; }
    [StringLength(500)] public string? Links { get; init; }
    [StringLength(2000)] public string? Message { get; init; }
}

public record JobApplicationDto
{
    public string Id { get; init; } = "";
    public string JobId { get; init; } = "";
    public string JobTitle { get; init; } = "";
    public string Name { get; init; } = "";
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public string? Links { get; init; }
    public string? Message { get; init; }
    public ResumeFileDto? ResumeFile { get; init; }
    public string Status { get; init; } = "new";
    public string? Note { get; init; }
    public string AppliedAt { get; init; } = "";
}

public record ResumeFileDto(string Name, long Size, string Type, string Url);

public record UpdateApplicantStatusDto
{
    [Required] public string Status { get; init; } = null!;
    public string? Note { get; init; }
}

// ========== SITE SETTINGS ==========
public record SiteSettingsDto
{
    public string Phone { get; init; } = "";
    public string Email { get; init; } = "";
    public LocalizedStringDto Address { get; init; } = new();
    public string? Instagram { get; init; }
    public string? Linkedin { get; init; }
    public string? Telegram { get; init; }
    public string? Whatsapp { get; init; }
}

// ========== DASHBOARD ==========
public record DashboardMetrics
{
    public int TotalServiceRequests { get; init; }
    public int NewServiceRequests { get; init; }
    public int PublishedJobs { get; init; }
    public int TotalApplicants { get; init; }
    public int NewApplicants { get; init; }
    public int TotalProjects { get; init; }
    public List<ServiceRequestDto> RecentRequests { get; init; } = new();
    public List<JobApplicationDto> RecentApplications { get; init; } = new();
}
