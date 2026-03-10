using MongoDB.Bson.Serialization.Attributes;

namespace ApexDigital.Domain.Entities;

/// <summary>
/// Client service request / lead. Matches form in HomePage.tsx.
/// Fields: name, company, email, phone, service, budget, timeline, description, consent, files
/// </summary>
[BsonIgnoreExtraElements]
public class ServiceRequest : BaseEntity
{
    [BsonElement("name")] public string Name { get; set; } = null!;
    [BsonElement("company")] public string? Company { get; set; }
    [BsonElement("email")] public string? Email { get; set; }
    [BsonElement("phone")] public string Phone { get; set; } = null!;
    [BsonElement("service")] public string? Service { get; set; }
    [BsonElement("budget")] public string? Budget { get; set; }
    [BsonElement("timeline")] public string? Timeline { get; set; }
    [BsonElement("description")] public string? Description { get; set; }
    [BsonElement("attachments")] public List<AttachmentInfo> Attachments { get; set; } = new();
    [BsonElement("status")] public string Status { get; set; } = "new"; // new | inProgress | processed | rejected
    [BsonElement("processed")] public bool Processed { get; set; } = false;
    [BsonElement("adminNote")] public string? AdminNote { get; set; }
}

public class AttachmentInfo
{
    [BsonElement("name")] public string Name { get; set; } = "";
    [BsonElement("size")] public long Size { get; set; }
    [BsonElement("url")] public string Url { get; set; } = "";
    [BsonElement("storedFileName")] public string StoredFileName { get; set; } = "";
}
