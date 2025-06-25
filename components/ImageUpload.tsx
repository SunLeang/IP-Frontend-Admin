"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import {
  uploadImageToMinio,
  deleteImageFromMinio,
  getMinioImageUrl,
} from "@/app/(api)/file_upload_api";

interface ImageUploadProps {
  value?: string;
  onChange: (filename: string | null) => void;
  folder?: string;
  maxSize?: number;
  accept?: string;
  className?: string;
  placeholder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "general",
  maxSize = 10,
  accept = "image/*",
  className = "",
  placeholder = "Click to upload image or drag and drop",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type for images
    if (accept === "image/*" && !file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Delete previous image if exists
      if (value) {
        try {
          await deleteImageFromMinio(value);
        } catch (deleteError) {
          console.warn("Failed to delete previous image:", deleteError);
        }
      }

      // Upload new image
      const result = await uploadImageToMinio(file, folder);
      onChange(result.data.filename);
    } catch (uploadError) {
      console.error("Upload failed:", uploadError);
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed"
      );
    } finally {
      setIsUploading(false);
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
        await deleteImageFromMinio(value);
        onChange(null);
      } catch (deleteError) {
        console.error("Failed to delete image:", deleteError);
        setError("Failed to delete image");
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/assets/images/placeholder.png";
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : value
            ? "border-green-300 bg-green-50"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
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
        />

        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : value ? (
          <div className="space-y-2">
            <div className="relative inline-block">
              {/* ✅ Updated: Use regular img tag for MinIO images */}
              <img
                src={getMinioImageUrl(value)}
                alt="Uploaded image"
                className="max-h-32 max-w-full rounded object-cover"
                onError={handleImageError}
                style={{ width: "128px", height: "128px" }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="text-sm text-green-600">
              ✅ Image uploaded successfully
            </p>
          </div>
        ) : (
          <div className="space-y-2">
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

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}
    </div>
  );
}
