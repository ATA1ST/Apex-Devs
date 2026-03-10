using ApexDigital.Application.DTOs;
using ApexDigital.Application.Services;
using ApexDigital.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace ApexDigital.Api.Controllers;

[ApiController]
[Route("api/jobs")]
public class JobsController : ControllerBase
{
    private readonly MongoDbContext _db;

    public JobsController(MongoDbContext db) => _db = db;

    /// <summary>GET /api/jobs — Public visible published jobs</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? department, [FromQuery] string? location)
    {
        var filter = Builders<Domain.Entities.JobVacancy>.Filter.Eq(j => j.Status, "published")
                   & Builders<Domain.Entities.JobVacancy>.Filter.Eq(j => j.IsVisible, true);

        if (!string.IsNullOrEmpty(department))
            filter &= Builders<Domain.Entities.JobVacancy>.Filter.Eq(j => j.Department, department);
        if (!string.IsNullOrEmpty(location))
            filter &= Builders<Domain.Entities.JobVacancy>.Filter.Eq(j => j.Location, location);

        var jobs = await _db.Jobs.Find(filter).SortByDescending(j => j.CreatedAt).ToListAsync();
        return Ok(jobs.Select(j => j.ToDto()));
    }

    /// <summary>GET /api/jobs/{slug} — Job detail by slug, increments views</summary>
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var job = await _db.Jobs.Find(j => j.Slug == slug && j.Status == "published" && j.IsVisible).FirstOrDefaultAsync();
        if (job == null) return NotFound(new ApiError("Вакансия не найдена"));

        // Increment views
        await _db.Jobs.UpdateOneAsync(j => j.Id == job.Id,
            Builders<Domain.Entities.JobVacancy>.Update.Inc(j => j.Views, 1));
        job.Views++;

        return Ok(job.ToDto());
    }
}
