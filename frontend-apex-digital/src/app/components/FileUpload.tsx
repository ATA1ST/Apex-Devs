import { useRef, useState } from 'react';
import { Upload, X, File, Image, Video, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'done' | 'error';
}

interface FileUploadProps {
  onFilesChange?: (files: File[]) => void;
  maxSize?: number; // in bytes
  maxFiles?: number;
  accept?: string;
  hint?: string;
}

export function FileUpload({
  onFilesChange,
  maxSize = 100 * 1024 * 1024, // 100MB
  maxFiles = 10,
  accept = '*',
  hint,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return Image;
    }
    if (['mp4', 'mov', 'avi', 'webm'].includes(extension || '')) {
      return Video;
    }
    if (['pdf', 'doc', 'docx', 'txt'].includes(extension || '')) {
      return FileText;
    }
    return File;
  };

  const simulateUpload = (fileId: string) => {
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress: 100, status: 'done' } : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
        );
      }
    }, 200);
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const validFiles = fileArray.filter((file) => {
      if (file.size > maxSize) {
        alert(`Файл ${file.name} слишком большой. Максимум ${formatFileSize(maxSize)}`);
        return false;
      }
      return true;
    });

    if (files.length + validFiles.length > maxFiles) {
      alert(`Максимум ${maxFiles} файлов`);
      return;
    }

    const uploadedFiles: UploadedFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading',
    }));

    setFiles((prev) => [...prev, ...uploadedFiles]);
    uploadedFiles.forEach((uf) => simulateUpload(uf.id));

    // Notify parent
    onFilesChange?.(
      [...files.map((f) => f.file), ...validFiles]
    );
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter((f) => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles.map((f) => f.file));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#1973AE] bg-[#D1EDF4]/20'
            : 'border-gray-300 hover:border-[#1973AE] hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="space-y-2">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              Нажмите или перетащите файлы
            </p>
            {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
            <p className="text-xs text-gray-500 mt-2">
              До {formatFileSize(maxSize)} на файл, максимум {maxFiles} файлов
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((uploadedFile) => {
            const Icon = getFileIcon(uploadedFile.file.name);
            return (
              <div
                key={uploadedFile.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <Icon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {uploadedFile.file.name}
                    </p>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatFileSize(uploadedFile.file.size)}
                    </span>
                  </div>
                  {uploadedFile.status === 'uploading' && (
                    <Progress value={uploadedFile.progress} className="h-1" />
                  )}
                  {uploadedFile.status === 'done' && (
                    <p className="text-xs text-green-600">Загружено</p>
                  )}
                </div>
                <button
                  onClick={() => removeFile(uploadedFile.id)}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
