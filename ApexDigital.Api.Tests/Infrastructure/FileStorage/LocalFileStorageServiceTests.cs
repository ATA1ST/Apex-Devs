using ApexDigital.Infrastructure.FileStorage;
using NUnit.Framework;

namespace ApexDigital.Api.Tests.Infrastructure.FileStorage;

[TestFixture]
public class LocalFileStorageServiceTests
{
    private string _basePath = null!;
    private LocalFileStorageService _service = null!;

    [SetUp]
    public void SetUp()
    {
        _basePath = Path.Combine(Path.GetTempPath(), "apex-tests", Guid.NewGuid().ToString("N"));
        _service = new LocalFileStorageService(new FileStorageSettings
        {
            BasePath = _basePath,
            MaxFileSizeBytes = 1024 * 1024,
        });
    }

    [TearDown]
    public void TearDown()
    {
        if (Directory.Exists(_basePath))
            Directory.Delete(_basePath, true);
    }

    [Test]
    public async Task SaveGetAndDelete_RoundTripsFile()
    {
        await using var source = new MemoryStream(System.Text.Encoding.UTF8.GetBytes("resume-content"));

        var (storedName, _) = await _service.SaveAsync(source, "resume.pdf", "application/pdf", "resumes");
        var result = await _service.GetAsync(storedName, "resumes");

        Assert.That(result, Is.Not.Null);

        await using (result!.Value.stream)
        using (var reader = new StreamReader(result.Value.stream))
        {
            var content = await reader.ReadToEndAsync();
            Assert.That(content, Is.EqualTo("resume-content"));
        }

        await _service.DeleteAsync(storedName, "resumes");
        var afterDelete = await _service.GetAsync(storedName, "resumes");
        Assert.That(afterDelete, Is.Null);
    }

    [Test]
    public void ValidateFile_RejectsUnsupportedExtension()
    {
        var isValid = _service.ValidateFile("script.exe", "application/octet-stream", 128, out var error);

        Assert.That(isValid, Is.False);
        Assert.That(error, Does.Contain("not allowed"));
    }
}

