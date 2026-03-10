using ApexDigital.Domain.Enums;
using MongoDB.Bson.Serialization.Attributes;

namespace ApexDigital.Domain.Entities;

/// <summary>
/// Matches frontend Project interface from mockData.ts
/// </summary>
[BsonIgnoreExtraElements]
public class Project : BaseEntity
{
    [BsonElement("slug")] public string Slug { get; set; } = null!;
    [BsonElement("title")] public LocalizedString Title { get; set; } = new();
    [BsonElement("description")] public LocalizedString Description { get; set; } = new();
    [BsonElement("fullDescription")] public LocalizedString? FullDescription { get; set; }
    [BsonElement("challenge")] public LocalizedString? Challenge { get; set; }
    [BsonElement("solution")] public LocalizedString? Solution { get; set; }
    [BsonElement("features")] public LocalizedStringArray? Features { get; set; }
    [BsonElement("category")] public string Category { get; set; } = "web"; // web | mobile | ongoing
    [BsonElement("status")] public string Status { get; set; } = "progress"; // done | progress | discovery
    [BsonElement("tags")] public List<string> Tags { get; set; } = new();
    [BsonElement("image")] public string Image { get; set; } = "";
    [BsonElement("gallery")] public List<string>? Gallery { get; set; }
    [BsonElement("goals")] public LocalizedStringArray? Goals { get; set; }
    [BsonElement("stack")] public List<string>? Stack { get; set; }
    [BsonElement("results")] public LocalizedString? Results { get; set; }
    [BsonElement("isVisible")] public bool IsVisible { get; set; } = true;
    [BsonElement("timeline")] public LocalizedString? Timeline { get; set; }
}
