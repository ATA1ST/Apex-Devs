using MongoDB.Bson.Serialization.Attributes;

namespace ApexDigital.Domain.Entities;

[BsonIgnoreExtraElements]
public class AuditLog : BaseEntity
{
    [BsonElement("action")] public string Action { get; set; } = null!; // login, logout, create, update, delete
    [BsonElement("entity")] public string? Entity { get; set; } // Job, Project, ServiceRequest...
    [BsonElement("entityId")] public string? EntityId { get; set; }
    [BsonElement("adminLogin")] public string AdminLogin { get; set; } = null!;
    [BsonElement("details")] public string? Details { get; set; }
    [BsonElement("ipAddress")] public string? IpAddress { get; set; }
}
