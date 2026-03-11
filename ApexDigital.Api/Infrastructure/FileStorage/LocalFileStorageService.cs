using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;

namespace ApexDigital.Infrastructure.FileStorage;

public class FileStorageSettings
{
    public string Provider { get; set; } = "Local";
    public string BasePath { get; set; } = "uploads";
    public long MaxFileSizeBytes { get; set; } = 20 * 1024 * 1024;
    public string[] AllowedExtensions { get; set; } = { ".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".webp" };
    public string[] AllowedMimeTypes { get; set; } =
    {
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg", "image/png", "image/webp"
    };
    public S3StorageSettings S3 { get; set; } = new();
}

public class S3StorageSettings
{
    public string BucketName { get; set; } = "";
    public string Region { get; set; } = "";
    public string AccessKey { get; set; } = "";
    public string SecretKey { get; set; } = "";
    public string? ServiceUrl { get; set; }
    public bool ForcePathStyle { get; set; }
}

public interface IFileStorageService
{
    Task<(string storedName, string relativePath)> SaveAsync(Stream stream, string originalFileName, string contentType, string subfolder);
    Task<(Stream stream, string contentType)?> GetAsync(string storedFileName, string subfolder);
    Task DeleteAsync(string storedFileName, string subfolder);
    bool ValidateFile(string fileName, string contentType, long size, out string error);
}

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
        if (!Path.GetFullPath(fullPath).StartsWith(_basePath))
            throw new InvalidOperationException("Path traversal detected.");

        await using var fs = new FileStream(fullPath, FileMode.Create, FileAccess.Write);
        await stream.CopyToAsync(fs);

        return (storedName, $"{subfolder}/{storedName}");
    }

    public Task<(Stream stream, string contentType)?> GetAsync(string storedFileName, string subfolder)
    {
        var safeName = Path.GetFileName(storedFileName);
        var folder = Path.Combine(_basePath, SanitizeSubfolder(subfolder));
        var fullPath = Path.Combine(folder, safeName);

        if (!Path.GetFullPath(fullPath).StartsWith(_basePath))
            return Task.FromResult<(Stream, string)?>(null);

        if (!File.Exists(fullPath))
            return Task.FromResult<(Stream, string)?>(null);

        var ext = Path.GetExtension(safeName).ToLowerInvariant();
        var mime = GetMimeType(ext);

        Stream stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
        return Task.FromResult<(Stream, string)?>((stream, mime));
    }

    public Task DeleteAsync(string storedFileName, string subfolder)
    {
        var safeName = Path.GetFileName(storedFileName);
        var folder = Path.Combine(_basePath, SanitizeSubfolder(subfolder));
        var fullPath = Path.Combine(folder, safeName);

        if (Path.GetFullPath(fullPath).StartsWith(_basePath) && File.Exists(fullPath))
            File.Delete(fullPath);

        return Task.CompletedTask;
    }

    private static string SanitizeSubfolder(string subfolder) =>
        new(subfolder.Where(c => char.IsLetterOrDigit(c) || c == '-' || c == '_').ToArray());

    private static string GetMimeType(string ext) => ext switch
    {
        ".pdf" => "application/pdf",
        ".doc" => "application/msword",
        ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".jpg" or ".jpeg" => "image/jpeg",
        ".png" => "image/png",
        ".webp" => "image/webp",
        _ => "application/octet-stream"
    };
}

public class S3FileStorageService : IFileStorageService
{
    private readonly FileStorageSettings _settings;
    private readonly IAmazonS3 _s3;
    private readonly string _bucketName;

    public S3FileStorageService(FileStorageSettings settings)
    {
        _settings = settings;
        _bucketName = settings.S3.BucketName;

        if (string.IsNullOrWhiteSpace(_bucketName))
            throw new InvalidOperationException("FileStorage:S3:BucketName is required for S3 storage.");

        var credentials = new BasicAWSCredentials(settings.S3.AccessKey, settings.S3.SecretKey);
        var config = new AmazonS3Config();

        if (!string.IsNullOrWhiteSpace(settings.S3.ServiceUrl))
        {
            config.ServiceURL = settings.S3.ServiceUrl;
            config.ForcePathStyle = settings.S3.ForcePathStyle;
        }
        else if (!string.IsNullOrWhiteSpace(settings.S3.Region))
        {
            config.RegionEndpoint = RegionEndpoint.GetBySystemName(settings.S3.Region);
        }
        else
        {
            throw new InvalidOperationException("Either FileStorage:S3:Region or FileStorage:S3:ServiceUrl is required for S3 storage.");
        }

        _s3 = new AmazonS3Client(credentials, config);
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

    public async Task<(string storedName, string relativePath)> SaveAsync(Stream stream, string originalFileName, string contentType, string subfolder)
    {
        var ext = Path.GetExtension(originalFileName).ToLowerInvariant();
        var storedName = $"{Guid.NewGuid():N}{ext}";
        var key = BuildKey(subfolder, storedName);

        var request = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = key,
            InputStream = stream,
            ContentType = contentType,
            AutoCloseStream = false,
        };

        await _s3.PutObjectAsync(request);
        return (storedName, key);
    }

    public async Task<(Stream stream, string contentType)?> GetAsync(string storedFileName, string subfolder)
    {
        var key = BuildKey(subfolder, storedFileName);

        try
        {
            using var response = await _s3.GetObjectAsync(_bucketName, key);
            var memory = new MemoryStream();
            await response.ResponseStream.CopyToAsync(memory);
            memory.Position = 0;
            return (memory, response.Headers.ContentType ?? "application/octet-stream");
        }
        catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }
    }

    public async Task DeleteAsync(string storedFileName, string subfolder)
    {
        var key = BuildKey(subfolder, storedFileName);
        await _s3.DeleteObjectAsync(_bucketName, key);
    }

    private static string BuildKey(string subfolder, string storedFileName)
    {
        var safeFolder = new string(subfolder.Where(c => char.IsLetterOrDigit(c) || c == '-' || c == '_').ToArray());
        var safeName = Path.GetFileName(storedFileName);
        return $"{safeFolder}/{safeName}";
    }
}
