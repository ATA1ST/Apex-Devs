namespace ApexDigital.Infrastructure.FileStorage;

public class FileStorageSettings
{
    public string BasePath { get; set; } = "uploads";
    public long MaxFileSizeBytes { get; set; } = 20 * 1024 * 1024; // 20 MB
    public string[] AllowedExtensions { get; set; } = { ".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".webp" };
    public string[] AllowedMimeTypes { get; set; } =
    {
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg", "image/png", "image/webp"
    };
}

public interface IFileStorageService
{
    Task<(string storedName, string relativePath)> SaveAsync(Stream stream, string originalFileName, string contentType, string subfolder);
    Task<(Stream stream, string contentType)?> GetAsync(string storedFileName, string subfolder);
    void Delete(string storedFileName, string subfolder);
    bool ValidateFile(string fileName, string contentType, long size, out string error);
}

/// <summary>
/// Local filesystem storage. Production-minded:
/// - Sanitized file names (GUID-based)
/// - Extension & MIME validation
/// - Size limits
/// - Path traversal protection
/// - Files stored outside web root
/// 
/// For production scale: replace with S3/Azure Blob via same interface.
/// </summary>
public class LocalFileStorageService : IFileStorageService
{
    private readonly FileStorageSettings _settings;
    private readonly string _basePath;

    public LocalFileStorageService(FileStorageSettings settings)
    {
        _settings = settings;
        _basePath = Path.GetFullPath(settings.BasePath);
        Directory.CreateDirectory(_basePath);
    }

    public bool ValidateFile(string fileName, string contentType, long size, out string error)
    {
        error = "";
        if (size > _settings.MaxFileSizeBytes)
        {
            error = $"File too large. Max {_settings.MaxFileSizeBytes / (1024 * 1024)} MB.";
            return false;
        }

        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        if (!_settings.AllowedExtensions.Contains(ext))
        {
            error = $"File type '{ext}' not allowed.";
            return false;
        }

        var normalizedMime = contentType.ToLowerInvariant().Trim();
        if (!_settings.AllowedMimeTypes.Contains(normalizedMime))
        {
            error = $"MIME type '{contentType}' not allowed.";
            return false;
        }

        return true;
    }

    public async Task<(string storedName, string relativePath)> SaveAsync(
        Stream stream, string originalFileName, string contentType, string subfolder)
    {
        var ext = Path.GetExtension(originalFileName).ToLowerInvariant();
        var storedName = $"{Guid.NewGuid():N}{ext}";
        var folder = Path.Combine(_basePath, SanitizeSubfolder(subfolder));
        Directory.CreateDirectory(folder);

        var fullPath = Path.Combine(folder, storedName);
        // Verify no path traversal
        if (!Path.GetFullPath(fullPath).StartsWith(_basePath))
            throw new InvalidOperationException("Path traversal detected.");

        await using var fs = new FileStream(fullPath, FileMode.Create, FileAccess.Write);
        await stream.CopyToAsync(fs);

        return (storedName, $"{subfolder}/{storedName}");
    }

    public Task<(Stream stream, string contentType)?> GetAsync(string storedFileName, string subfolder)
    {
        var safeName = Path.GetFileName(storedFileName); // strip any path components
        var folder = Path.Combine(_basePath, SanitizeSubfolder(subfolder));
        var fullPath = Path.Combine(folder, safeName);

        if (!Path.GetFullPath(fullPath).StartsWith(_basePath))
            return Task.FromResult<(Stream, string)?>(null);

        if (!File.Exists(fullPath))
            return Task.FromResult<(Stream, string)?>(null);

        var ext = Path.GetExtension(safeName).ToLowerInvariant();
        var mime = ext switch
        {
            ".pdf" => "application/pdf",
            ".doc" => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".webp" => "image/webp",
            _ => "application/octet-stream"
        };

        Stream stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
        return Task.FromResult<(Stream, string)?>((stream, mime));
    }

    public void Delete(string storedFileName, string subfolder)
    {
        var safeName = Path.GetFileName(storedFileName);
        var folder = Path.Combine(_basePath, SanitizeSubfolder(subfolder));
        var fullPath = Path.Combine(folder, safeName);

        if (Path.GetFullPath(fullPath).StartsWith(_basePath) && File.Exists(fullPath))
            File.Delete(fullPath);
    }

    private static string SanitizeSubfolder(string subfolder)
    {
        // Only allow alphanumeric, dash, underscore
        return new string(subfolder.Where(c => char.IsLetterOrDigit(c) || c == '-' || c == '_').ToArray());
    }
}
