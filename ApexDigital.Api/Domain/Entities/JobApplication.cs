using MongoDB.Bson.Serialization.Attributes;

namespace ApexDigital.Domain.Entities;

/// <summary>
/// Matches frontend Applicant interface from jobsData.ts
/// </summary>
[BsonIgnoreExtraElements]
public class JobApplication : BaseEntity
{
    [BsonElement("jobId")] public string JobId { get; set; } = null!;
    [BsonElement("jobTitle")] public string JobTitle { get; set; } = "";
    [BsonElement("name")] public string Name { get; set; } = null!;
    [BsonElement("email")] public string? Email { get; set; }
    [BsonElement("phone")] public string? Phone { get; set; }
    [BsonElement("links")] public string? Links { get; set; }
    [BsonElement("message")] public string? Message { get; set; }
    [BsonElement("resumeFile")] public ResumeFileInfo? ResumeFile { get; set; }
    [BsonElement("status")] public string Status { get; set; } = "new"; // new | reviewed | rejected | invited
    [BsonElement("note")] public string? Note { get; set; }
    [BsonElement("appliedAt")] public string AppliedAt { get; set; } = DateTime.UtcNow.ToString("o");
}

public class ResumeFileInfo
{
    [BsonElement("name")] public string Name { get; set; } = "";
    [BsonElement("size")] public long Size { get; set; }
    [BsonElement("type")] public string Type { get; set; } = "";
    [BsonElement("url")] public string Url { get; set; } = "";
    [BsonElement("storedFileName")] public string StoredFileName { get; set; } = "";
}
