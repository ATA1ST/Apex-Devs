using MongoDB.Bson.Serialization.Attributes;

namespace ApexDigital.Domain.Entities;

[BsonIgnoreExtraElements]
public class AdminUser : BaseEntity
{
    [BsonElement("login")] public string Login { get; set; } = null!;
    [BsonElement("passwordHash")] public string PasswordHash { get; set; } = null!;
    [BsonElement("displayName")] public string DisplayName { get; set; } = "Admin";
    [BsonElement("lastLoginAt")] public DateTime? LastLoginAt { get; set; }
    [BsonElement("failedAttempts")] public int FailedAttempts { get; set; }
    [BsonElement("lockedUntil")] public DateTime? LockedUntil { get; set; }
}
