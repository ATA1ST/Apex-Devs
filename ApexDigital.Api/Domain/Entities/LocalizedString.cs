using MongoDB.Bson.Serialization.Attributes;

namespace ApexDigital.Domain.Entities;

/// <summary>
/// Trilingual text block (ru/kz/en) matching frontend { ru: string, kz: string, en: string }
/// </summary>
public class LocalizedString
{
    [BsonElement("ru")] public string Ru { get; set; } = "";
    [BsonElement("kz")] public string Kz { get; set; } = "";
    [BsonElement("en")] public string En { get; set; } = "";
}

/// <summary>
/// Trilingual string array matching frontend { ru: string[], kz: string[], en: string[] }
/// </summary>
public class LocalizedStringArray
{
    [BsonElement("ru")] public List<string> Ru { get; set; } = new();
    [BsonElement("kz")] public List<string> Kz { get; set; } = new();
    [BsonElement("en")] public List<string> En { get; set; } = new();
}
