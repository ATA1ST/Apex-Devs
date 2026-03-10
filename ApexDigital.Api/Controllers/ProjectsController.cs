using ApexDigital.Application.DTOs;
using ApexDigital.Application.Services;
using ApexDigital.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace ApexDigital.Api.Controllers;

[ApiController]
[Route("api/projects")]
public class ProjectsController : ControllerBase
{
    private readonly MongoDbContext _db;

    public ProjectsController(MongoDbContext db) => _db = db;

    /// <summary>GET /api/projects — Public list of visible projects</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? category)
    {
        var filter = Builders<Domain.Entities.Project>.Filter.Eq(p => p.IsVisible, true);
        if (!string.IsNullOrEmpty(category))
            filter &= Builders<Domain.Entities.Project>.Filter.Eq(p => p.Category, category);

        var projects = await _db.Projects.Find(filter).SortByDescending(p => p.CreatedAt).ToListAsync();
        return Ok(projects.Select(p => p.ToDto()));
    }

    /// <summary>GET /api/projects/{slug} — Project detail by slug</summary>
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var project = await _db.Projects.Find(p => p.Slug == slug && p.IsVisible).FirstOrDefaultAsync();
        if (project == null) return NotFound(new ApiError("Проект не найден"));
        return Ok(project.ToDto());
    }
}
