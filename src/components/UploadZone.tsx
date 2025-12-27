import React, { useCallback, useState } from 'react';
import { Upload, FileText, Video, Image as ImageIcon, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadZoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  onGenerate: () => void;
  isProcessing: boolean;
  disabled?: boolean;
}

const getFileIcon = (type: string) => {
  if (type.startsWith('video/')) return Video;
  if (type.startsWith('image/')) return ImageIcon;
  return FileText;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const UploadZone: React.FC<UploadZoneProps> = ({
  file,
  onFileSelect,
  onGenerate,
  isProcessing,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isProcessing) {
      setIsDragging(true);
    }
  }, [disabled, isProcessing]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isProcessing) return;

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  }, [disabled, isProcessing, onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  const FileIcon = file ? getFileIcon(file.type) : Upload;

  return (
    <div className="bg-card border-2 border-border rounded-xl p-6 shadow-soft">
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
        <Upload className="h-5 w-5 text-primary" />
        Upload Study Material
      </h2>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
          ${isDragging
            ? 'border-primary bg-accent scale-[1.02]'
            : file
              ? 'border-success bg-success/5'
              : 'border-border hover:border-primary/50 hover:bg-accent/50'
          }
          ${(disabled || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          type="file"
          accept="application/pdf,image/*,video/*"
          onChange={handleFileInput}
          disabled={disabled || isProcessing}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        {file ? (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-xl bg-success/10 flex items-center justify-center">
              <FileIcon className="h-8 w-8 text-success" />
            </div>
            <div>
              <p className="font-semibold text-foreground truncate max-w-xs mx-auto">
                {file.name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatFileSize(file.size)}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(null);
              }}
              disabled={disabled || isProcessing}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Remove File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-xl bg-accent flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Drop your file here or click to browse
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports PDF, Images, and Video files
              </p>
            </div>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" /> PDF
              </span>
              <span className="flex items-center gap-1">
                <ImageIcon className="h-3 w-3" /> Images
              </span>
              <span className="flex items-center gap-1">
                <Video className="h-3 w-3" /> Video
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <Button
        onClick={onGenerate}
        disabled={!file || isProcessing || disabled}
        className="w-full mt-6 h-12 text-base font-semibold gap-2 shadow-soft hover:shadow-medium transition-shadow"
      >
        <Sparkles className="h-5 w-5" />
        {isProcessing ? 'Generating Exam...' : 'Generate Exam Paper'}
      </Button>

      {isProcessing && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20"></div>
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 w-12 h-12 rounded-full border-4 border-primary/40 border-t-transparent animate-spin-slow"></div>
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">Processing your material...</p>
            <p className="text-sm text-muted-foreground mt-1">
              AI is analyzing and generating questions
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
