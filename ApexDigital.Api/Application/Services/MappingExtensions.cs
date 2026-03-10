using ApexDigital.Application.DTOs;
using ApexDigital.Domain.Entities;

namespace ApexDigital.Application.Services;

public static class MappingExtensions
{
    // ===== LocalizedString =====
    public static LocalizedStringDto ToDto(this LocalizedString ls) =>
        new() { Ru = ls.Ru, Kz = ls.Kz, En = ls.En };

    public static LocalizedString ToEntity(this LocalizedStringDto dto) =>
        new() { Ru = dto.Ru, Kz = dto.Kz, En = dto.En };

    public static LocalizedStringArrayDto? ToDto(this LocalizedStringArray? la) =>
        la == null ? null : new() { Ru = la.Ru, Kz = la.Kz, En = la.En };

    public static LocalizedStringArray? ToEntity(this LocalizedStringArrayDto? dto) =>
        dto == null ? null : new() { Ru = dto.Ru, Kz = dto.Kz, En = dto.En };

    // ===== Project =====
    public static ProjectDto ToDto(this Project p) => new()
    {
        Id = p.Id, Slug = p.Slug,
        Title = p.Title.ToDto(), Description = p.Description.ToDto(),
        FullDescription = p.FullDescription?.ToDto(), Challenge = p.Challenge?.ToDto(),
        Solution = p.Solution?.ToDto(), Features = p.Features?.ToDto(),
        Category = p.Category, Status = p.Status, Tags = p.Tags,
        Image = p.Image, Gallery = p.Gallery, Goals = p.Goals?.ToDto(),
        Stack = p.Stack, Results = p.Results?.ToDto(), IsVisible = p.IsVisible,
        Timeline = p.Timeline?.ToDto(),
    };

    // ===== Job =====
    public static JobDto ToDto(this JobVacancy j) => new()
    {
        Id = j.Id, Slug = j.Slug,
        Title = j.Title.ToDto(), ShortDescription = j.ShortDescription.ToDto(),
        Requirements = j.Requirements.Select(r => r.ToDto()).ToList(),
        PostedDate = j.PostedDate, Department = j.Department,
        Location = j.Location, EmploymentType = j.EmploymentType,
        Status = j.Status, IsVisible = j.IsVisible,
        Description = new JobDescriptionLocalizedDto
        {
            Ru = j.Description.Ru.ToDto(), Kz = j.Description.Kz.ToDto(), En = j.Description.En.ToDto(),
        },
        Stack = j.Stack, Views = j.Views, Applicants = j.Applicants,
        PublishedAt = j.PublishedAt, UpdatedAt = j.UpdatedAt.ToString("o"),
    };

    public static JobDescriptionBlockDto ToDto(this JobDescriptionBlock b) => new()
    {
        Role = b.Role, Tasks = b.Tasks, Requirements = b.Requirements,
        PlusPoints = b.PlusPoints, Conditions = b.Conditions,
    };

    public static JobDescriptionBlock ToEntity(this JobDescriptionBlockDto dto) => new()
    {
        Role = dto.Role, Tasks = dto.Tasks, Requirements = dto.Requirements,
        PlusPoints = dto.PlusPoints, Conditions = dto.Conditions,
    };

    // ===== ServiceRequest =====
    public static ServiceRequestDto ToDto(this ServiceRequest sr, string baseUrl) => new()
    {
        Id = sr.Id, Name = sr.Name, Company = sr.Company, Email = sr.Email,
        Phone = sr.Phone, Service = sr.Service, Budget = sr.Budget,
        Timeline = sr.Timeline, Description = sr.Description,
        Attachments = sr.Attachments.Select(a => new AttachmentInfoDto(a.Name, a.Size, $"{baseUrl}/api/files/requests/{a.StoredFileName}")).ToList(),
        Status = sr.Status, Processed = sr.Processed, AdminNote = sr.AdminNote,
        CreatedAt = sr.CreatedAt.ToString("yyyy-MM-dd"),
    };

    // ===== JobApplication =====
    public static JobApplicationDto ToDto(this JobApplication a, string baseUrl) => new()
    {
        Id = a.Id, JobId = a.JobId, JobTitle = a.JobTitle,
        Name = a.Name, Email = a.Email, Phone = a.Phone,
        Links = a.Links, Message = a.Message,
        ResumeFile = a.ResumeFile == null ? null : new ResumeFileDto(
            a.ResumeFile.Name, a.ResumeFile.Size, a.ResumeFile.Type,
            $"{baseUrl}/api/files/resumes/{a.ResumeFile.StoredFileName}"),
        Status = a.Status, Note = a.Note, AppliedAt = a.AppliedAt,
    };

    // ===== SiteSettings =====
    public static SiteSettingsDto ToDto(this SiteSettings s) => new()
    {
        Phone = s.Phone, Email = s.Email, Address = s.Address.ToDto(),
        Instagram = s.Instagram, Linkedin = s.Linkedin, Telegram = s.Telegram, Whatsapp = s.Whatsapp,
    };
}
