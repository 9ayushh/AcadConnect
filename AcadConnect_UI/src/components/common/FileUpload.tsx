import React, { useState, useCallback } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, RefreshCw } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';
import { MAX_FILE_SIZE_BYTES } from '../../utils/constants';

export interface FileUploadProps {
  label: string;
  helperText?: string;
  accept?: Accept;
  maxSizeBytes?: number;
  onFileSelect: (file: File | null) => void;
  selectedFileName?: string;
  required?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  helperText,
  accept,
  maxSizeBytes = MAX_FILE_SIZE_BYTES,
  onFileSelect,
  selectedFileName,
  required = false,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const simulateUpload = useCallback((f: File) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 25;
      });
    }, 80);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: unknown[]) => {
      if (fileRejections.length > 0) {
        setError('Invalid file type or size exceeds limit.');
        return;
      }
      if (acceptedFiles.length > 0) {
        const chosen = acceptedFiles[0];
        if (chosen.size > maxSizeBytes) {
          setError(`File exceeds maximum size of ${formatFileSize(maxSizeBytes)}`);
          return;
        }
        setError(null);
        setFile(chosen);
        onFileSelect(chosen);
        simulateUpload(chosen);
      }
    },
    [maxSizeBytes, onFileSelect, simulateUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    multiple: false,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setError(null);
    setProgress(0);
    onFileSelect(null);
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (file) {
      simulateUpload(file);
    }
  };

  const currentName = file?.name || selectedFileName;

  return (
    <div className="w-full space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {!currentName ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-150 flex flex-col items-center justify-center
            ${
              isDragActive
                ? 'border-indigo-500 bg-indigo-50/50'
                : error
                ? 'border-red-300 bg-red-50/20'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-white'
            }`}
        >
          <input {...getInputProps()} />
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-slate-700">
            {isDragActive ? 'Drop file here...' : 'Click to upload or drag & drop'}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {helperText || `Max size: ${formatFileSize(maxSizeBytes)}`}
          </p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-slate-900 truncate">{currentName}</p>
                <p className="text-xs text-slate-500">
                  {file ? formatFileSize(file.size) : 'Uploaded document'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-3">
              {isUploading ? (
                <span className="text-xs text-indigo-600 font-medium">{progress}%</span>
              ) : progress === 100 || selectedFileName ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : null}

              {error && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="p-1 text-slate-400 hover:text-slate-600"
                  title="Retry"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handleRemove}
                className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Upload progress bar */}
          {isUploading && (
            <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="text-xs text-red-600 font-medium flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
