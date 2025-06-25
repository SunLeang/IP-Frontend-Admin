import API from "../utils/AxiosInstance";

export interface MinioUploadResponse {
  data: {
    filename: string;
    originalName: string;
    size: number;
    url: string;
  };
}

export interface MinioDeleteResponse {
  success: boolean;
  message: string;
}

/**
 * Upload image to MinIO storage
 * @param file - The file to upload
 * @param folder - The folder path in MinIO (e.g., 'events', 'announcements', 'profiles')
 * @returns Promise with upload result
 */
export async function uploadImageToMinio(
  file: File,
  folder: string = "general"
): Promise<MinioUploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    console.log(`📤 Uploading file to MinIO folder: ${folder}`);

    const response = await API.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ File uploaded successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to upload file to MinIO:", error);
    throw new Error("Failed to upload file. Please try again.");
  }
}

/**
 * Delete image from MinIO storage
 * @param filename - The filename to delete
 * @returns Promise with deletion result
 */
export async function deleteImageFromMinio(
  filename: string
): Promise<MinioDeleteResponse> {
  try {
    console.log(`🗑️ Deleting file from MinIO: ${filename}`);

    const response = await API.delete(`/upload/${filename}`);

    console.log("✅ File deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to delete file from MinIO:", error);
    throw new Error("Failed to delete file. Please try again.");
  }
}

/**
 * Get MinIO image URL
 * @param filename - The filename to get URL for
 * @returns Full URL to the image
 */
export function getMinioImageUrl(filename: string): string {
  if (!filename) return "/assets/images/placeholder.png";

  if (filename.startsWith("http")) return filename;

  const baseUrl = process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000";


  if (filename.startsWith("images/") || filename.startsWith("eventura/")) {
    return `${baseUrl}/${filename}`;
  }

  const bucketName = "images";
  return `${baseUrl}/${bucketName}/${filename}`;
}

/**
 * Upload multiple files to MinIO
 * @param files - Array of files to upload
 * @param folder - The folder path in MinIO
 * @returns Promise with array of upload results
 */
export async function uploadMultipleFiles(
  files: File[],
  folder: string = "general"
): Promise<MinioUploadResponse[]> {
  try {
    const uploadPromises = files.map((file) =>
      uploadImageToMinio(file, folder)
    );
    const results = await Promise.all(uploadPromises);

    console.log(`✅ Successfully uploaded ${results.length} files`);
    return results;
  } catch (error) {
    console.error("❌ Failed to upload multiple files:", error);
    throw new Error("Failed to upload files. Please try again.");
  }
}

/**
 * Check if file type is supported
 * @param file - File to check
 * @param allowedTypes - Array of allowed MIME types
 * @returns boolean
 */
export function isFileTypeSupported(
  file: File,
  allowedTypes: string[] = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ]
): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Check if file size is within limit
 * @param file - File to check
 * @param maxSizeMB - Maximum size in MB
 * @returns boolean
 */
export function isFileSizeValid(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Validate file before upload
 * @param file - File to validate
 * @param options - Validation options
 * @returns Validation result
 */
export function validateFile(
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  } = {}
): { isValid: boolean; error?: string } {
  const {
    maxSizeMB = 10,
    allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  } = options;

  if (!isFileTypeSupported(file, allowedTypes)) {
    return {
      isValid: false,
      error: `File type not supported. Allowed types: ${allowedTypes.join(
        ", "
      )}`,
    };
  }

  if (!isFileSizeValid(file, maxSizeMB)) {
    return {
      isValid: false,
      error: `File size too large. Maximum size: ${maxSizeMB}MB`,
    };
  }

  return { isValid: true };
}
