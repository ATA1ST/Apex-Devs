using MongoDB.Bson.Serialization.Attributes;

namespace ApexDigital.Domain.Entities;

[BsonIgnoreExtraElements]
public class SiteSettings : BaseEntity
{
    [BsonElement("phone")] public string Phone { get; set; } = "+7 747 226 68 85";
    [BsonElement("email")] public string Email { get; set; } = "info@apexdigital.kz";
    [BsonElement("address")] public LocalizedString Address { get; set; } = new()
    {
        Ru = "Астана, Казахстан", Kz = "Астана, Қазақстан", En = "Astana, Kazakhstan"
    };
    [BsonElement("instagram")] public string? Instagram { get; set; }
    [BsonElement("linkedin")] public string? Linkedin { get; set; }
    [BsonElement("telegram")] public string? Telegram { get; set; }
    [BsonElement("whatsapp")] public string? Whatsapp { get; set; }
}
