using ApexDigital.Application.Services;
using ApexDigital.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace ApexDigital.Api.Controllers;

[ApiController]
[Route("api/settings")]
public class SettingsController : ControllerBase
{
    private readonly MongoDbContext _db;
    public SettingsController(MongoDbContext db) => _db = db;

    /// <summary>GET /api/settings — Public site settings</summary>
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var settings = await _db.SiteSettings.Find(_ => true).FirstOrDefaultAsync();
        if (settings == null) return Ok(new Domain.Entities.SiteSettings().ToDto());
        return Ok(settings.ToDto());
    }
}
