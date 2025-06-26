"use client";

import { useState, useRef } from "react";
import { Upload, X, AlertCircle, RefreshCw } from "lucide-react";
import {
  uploadImageToMinio,
  uploadDocumentToMinio,
  deleteImageFromMinio,
  deleteDocumentFromMinio,
  getMinioImageUrl,
  validateFile,
} from "@/app/(api)/file_upload_api";

interface ImageUploadProps {
  value?: string;
  onChange: (filename: string | null) => void;
  folder?: string;
  maxSize?: number;
  accept?: string;
  className?: string;
  placeholder?: string;
  isDocument?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "general",
  maxSize = 10,
  accept = "image/*",
  className = "",
  placeholder = "Click to upload image or drag and drop",
  isDocument = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File, isRetry = false) => {
    // Reset states
    if (!isRetry) {
      setError(null);
      setProgress(0);
      setRetryCount(0);
    }

    // Validate file
    const validation = validateFile(file, {
      maxSizeMB: maxSize,
      isDocument,
      allowedTypes: isDocument
        ? [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ]
        : ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
    });

    if (!validation.isValid) {
      setError(validation.error || "Invalid file");
      return;
    }

    setIsUploading(true);

    try {
      console.log("🔄 Starting upload process...");

      // Check authentication before proceeding
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("refreshToken");
      if (!token) {
        throw new Error("Please login to upload files");
      }

      // Delete previous file if exists (only on first attempt)
      if (value && !isRetry) {
        try {
          if (isDocument) {
            await deleteDocumentFromMinio(value);
          } else {
            await deleteImageFromMinio(value);
          }
          console.log("✅ Previous file deleted");
        } catch (deleteError) {
          console.warn("⚠️ Failed to delete previous file:", deleteError);
          // Continue with upload even if delete fails
        }
      }

      // Upload new file
      console.log("📤 Uploading new file...");
      const uploadFunction = isDocument
        ? uploadDocumentToMinio
        : uploadImageToMinio;
      const result = await uploadFunction(file, folder);

      console.log("✅ Upload successful:", result);

      // Use the filename from the response
      onChange(result.data.filename);
      setProgress(100);
      setError(null);
      setRetryCount(0);
    } catch (uploadError: any) {
      console.error("❌ Upload failed:", uploadError);

      let errorMessage = "Upload failed. Please try again.";

      if (uploadError instanceof Error) {
        errorMessage = uploadError.message;
      } else if (typeof uploadError === "string") {
        errorMessage = uploadError;
      }

      // Handle auth errors specifically
      if (
        errorMessage.includes("Authentication") ||
        errorMessage.includes("login")
      ) {
        setError(
          "Authentication expired. Please refresh the page and try again."
        );
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  // Add retry functionality
  const handleRetry = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file && retryCount < 3) {
      setRetryCount((prev) => prev + 1);
      handleFileSelect(file, true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = async () => {
    if (value) {
      try {
        if (isDocument) {
          await deleteDocumentFromMinio(value);
        } else {
          await deleteImageFromMinio(value);
        }
        onChange(null);
        setError(null);
      } catch (deleteError) {
        console.error("Failed to delete file:", deleteError);
        setError("Failed to delete file");
      }
    }
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/assets/images/placeholder.png";
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-blue-500 bg-blue-50 scale-105"
            : isUploading
            ? "border-yellow-400 bg-yellow-50"
            : value
            ? "border-green-400 bg-green-50"
            : error
            ? "border-red-400 bg-red-50"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
        } ${isUploading ? "pointer-events-none" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600">
              Uploading... {retryCount > 0 && `(Retry ${retryCount}/3)`}
            </p>
            {progress > 0 && (
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
        ) : value ? (
          <div className="space-y-3">
            <div className="relative inline-block">
              {isDocument ? (
                <div className="flex items-center justify-center w-32 h-32 bg-gray-100 rounded border">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📄</div>
                    <div className="text-xs text-gray-600">Document</div>
                  </div>
                </div>
              ) : (
                <img
                  src={getMinioImageUrl(value)}
                  alt="Uploaded image"
                  className="w-32 h-32 rounded object-cover border"
                  onError={handleImageError}
                />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="text-sm text-green-600 font-medium">
              ✅ {isDocument ? "Document" : "Image"} uploaded successfully
            </p>
            <p className="text-xs text-gray-500">
              Click to replace or drag & drop a new file
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="h-8 w-8 text-gray-400 mx-auto" />
            <div>
              <p className="text-sm font-medium text-gray-700">{placeholder}</p>
              <p className="text-xs text-gray-500">
                {accept === "image/*"
                  ? `PNG, JPG, GIF up to ${maxSize}MB`
                  : `Files up to ${maxSize}MB`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message with Retry Button */}
      {error && (
        <div className="flex items-center justify-between text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          {retryCount < 3 &&
            !isUploading &&
            fileInputRef.current?.files?.[0] && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRetry();
                }}
                className="flex items-center space-x-1 text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Retry</span>
              </button>
            )}
        </div>
      )}
    </div>
  );
}
