using ApexDigital.Infrastructure.FileStorage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApexDigital.Api.Controllers;

[ApiController]
[Route("api/files")]
public class FilesController : ControllerBase
{
    private readonly IFileStorageService _files;

    public FilesController(IFileStorageService files) => _files = files;

    [HttpGet("projects/{fileName}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProjectFile(string fileName)
    {
        var result = await _files.GetAsync(fileName, "projects");
        if (result == null) return NotFound();

        var (stream, contentType) = result.Value;
        return File(stream, contentType);
    }

    [HttpGet("{subfolder}/{fileName}")]
    [Authorize]
    public async Task<IActionResult> Download(string subfolder, string fileName)
    {
        if (subfolder != "resumes" && subfolder != "requests")
            return NotFound();

        var result = await _files.GetAsync(fileName, subfolder);
        if (result == null) return NotFound();

        var (stream, contentType) = result.Value;
        return File(stream, contentType, fileName);
    }
}