using MongoDB.Bson.Serialization.Attributes;

namespace ApexDigital.Domain.Entities;

/// <summary>
/// Matches frontend Job interface from jobsData.ts exactly.
/// description field contains structured { role, tasks[], requirements[], plusPoints[], conditions[] } per language.
/// </summary>
[BsonIgnoreExtraElements]
public class JobVacancy : BaseEntity
{
    [BsonElement("slug")] public string Slug { get; set; } = null!;
    [BsonElement("title")] public LocalizedString Title { get; set; } = new();
    [BsonElement("shortDescription")] public LocalizedString ShortDescription { get; set; } = new();

    // Array of localized requirement strings
    [BsonElement("requirements")] public List<LocalizedString> Requirements { get; set; } = new();

    [BsonElement("postedDate")] public string PostedDate { get; set; } = "";
    [BsonElement("department")] public string Department { get; set; } = "dev"; // dev | design | pm | other
    [BsonElement("location")] public string Location { get; set; } = "astana"; // astana | remote | hybrid
    [BsonElement("employmentType")] public string EmploymentType { get; set; } = "full-time";
    [BsonElement("status")] public string Status { get; set; } = "draft"; // draft | published | closed
    [BsonElement("isVisible")] public bool IsVisible { get; set; } = true;

    // Structured description per language
    [BsonElement("description")] public JobDescriptionLocalized Description { get; set; } = new();

    [BsonElement("stack")] public List<string>? Stack { get; set; }
    [BsonElement("views")] public int Views { get; set; }
    [BsonElement("applicants")] public int Applicants { get; set; }
    [BsonElement("publishedAt")] public string? PublishedAt { get; set; }
}

public class JobDescriptionLocalized
{
    [BsonElement("ru")] public JobDescriptionBlock Ru { get; set; } = new();
    [BsonElement("kz")] public JobDescriptionBlock Kz { get; set; } = new();
    [BsonElement("en")] public JobDescriptionBlock En { get; set; } = new();
}

public class JobDescriptionBlock
{
    [BsonElement("role")] public string Role { get; set; } = "";
    [BsonElement("tasks")] public List<string> Tasks { get; set; } = new();
    [BsonElement("requirements")] public List<string> Requirements { get; set; } = new();
    [BsonElement("plusPoints")] public List<string> PlusPoints { get; set; } = new();
    [BsonElement("conditions")] public List<string> Conditions { get; set; } = new();
}
