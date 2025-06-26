import API from "../utils/AxiosInstance";

export interface MinioUploadResponse {
  data: {
    filename: string;
    originalName: string;
    size: number;
    url: string;
    originalUrl: string;
    thumbnailUrl: string;
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

    console.log(`📤 Uploading file to MinIO folder: ${folder}`);
    console.log("📤 File details:", {
      name: file.name,
      size: file.size,
      type: file.type, 
    });

    // Check authentication before upload
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("refreshToken");
    if (!token) {
      throw new Error("Authentication required. Please login again.");
    }

    const response = await API.post(
      `/file-upload/minio/image?folder=${folder}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      }
    );

    console.log("✅ Upload response:", response.data);

    // Handle different response structures
    const responseData = response.data;

    // Check if response has the expected structure
    if (!responseData || !responseData.data) {
      throw new Error("Invalid response from server");
    }

    return {
      data: {
        filename: responseData.data.filename || responseData.data.fileName,
        originalName: file.name,
        size: file.size,
        url: responseData.data.originalUrl || responseData.data.url,
        originalUrl: responseData.data.originalUrl || responseData.data.url,
        thumbnailUrl: responseData.data.thumbnailUrl || responseData.data.url,
      },
    };
  } catch (error: any) {
    console.error("❌ Failed to upload file to MinIO:", error);
    console.error("❌ Error details:", error.response?.data);

    // Better error handling
    if (error.response?.status === 401) {
      // Don't throw auth error here, let the interceptor handle it
      throw new Error("Authentication failed. Please try again.");
    } else if (error.response?.status === 413) {
      throw new Error("File size too large. Maximum size is 10MB.");
    } else if (error.response?.status === 400) {
      throw new Error("Invalid file type. Only images are allowed.");
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Upload timeout. Please try again.");
    } else if (error.message) {
      throw new Error(error.message);
    }

    throw new Error("Failed to upload file. Please try again.");
  }
}

/**
 * Upload document to MinIO storage
 * @param file - The file to upload
 * @param folder - The folder path in MinIO
 * @returns Promise with upload result
 */
export async function uploadDocumentToMinio(
  file: File,
  folder: string = "cvs"
): Promise<MinioUploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    console.log(`📤 Uploading document to MinIO folder: ${folder}`);

    // Check authentication
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("refreshToken");
    if (!token) {
      throw new Error("Authentication required. Please login again.");
    }

    const response = await API.post(
      `/file-upload/minio/document?folder=${folder}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      }
    );

    console.log("✅ Document upload response:", response.data);

    return {
      data: {
        filename: response.data.data.filename || response.data.data.fileName,
        originalName: file.name,
        size: file.size,
        url: response.data.data.documentUrl || response.data.data.url,
        originalUrl: response.data.data.documentUrl || response.data.data.url,
        thumbnailUrl: response.data.data.documentUrl || response.data.data.url,
      },
    };
  } catch (error: any) {
    console.error("❌ Failed to upload document to MinIO:", error);

    if (error.response?.status === 401) {
      throw new Error("Authentication failed. Please try again.");
    }

    throw new Error("Failed to upload document. Please try again.");
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

    const response = await API.delete(
      `/file-upload/minio/image/${encodeURIComponent(filename)}`
    );

    console.log("✅ File deleted successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Failed to delete file from MinIO:", error);

    // Don't fail silently on delete errors
    if (error.response?.status === 404) {
      console.warn("⚠️ File not found, considering as deleted");
      return { success: true, message: "File not found" };
    }

    throw new Error("Failed to delete file. Please try again.");
  }
}

/**
 * Delete document from MinIO storage
 * @param filename - The filename to delete
 * @returns Promise with deletion result
 */
export async function deleteDocumentFromMinio(
  filename: string
): Promise<MinioDeleteResponse> {
  try {
    console.log(`🗑️ Deleting document from MinIO: ${filename}`);

    const response = await API.delete(
      `/file-upload/minio/document/${encodeURIComponent(filename)}`
    );

    console.log("✅ Document deleted successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Failed to delete document from MinIO:", error);

    if (error.response?.status === 404) {
      console.warn("⚠️ Document not found, considering as deleted");
      return { success: true, message: "Document not found" };
    }

    throw new Error("Failed to delete document. Please try again.");
  }
}

// Keep other functions unchanged
export function getMinioImageUrl(filename: string): string {
  if (!filename) return "/assets/images/placeholder.png";

  if (filename.startsWith("http")) return filename;

  const baseUrl = process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000";

  if (filename.startsWith("images/")) {
    return `${baseUrl}/${filename}`;
  }

  return `${baseUrl}/images/${filename}`;
}

export function getMinioThumbnailUrl(filename: string): string {
  if (!filename) return "/assets/images/placeholder.png";

  if (filename.startsWith("http")) return filename;

  const baseUrl = process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000";

  if (filename.startsWith("thumbnails/")) {
    return `${baseUrl}/${filename}`;
  }

  return `${baseUrl}/thumbnails/${filename}`;
}

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

export function isFileTypeSupported(
  file: File,
  allowedTypes: string[] = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ]
): boolean {
  return allowedTypes.includes(file.type);
}

export function isDocumentTypeSupported(file: File): boolean {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  return allowedTypes.includes(file.type);
}

export function isFileSizeValid(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

export function validateFile(
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
    isDocument?: boolean;
  } = {}
): { isValid: boolean; error?: string } {
  const {
    maxSizeMB = 10,
    allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
    isDocument = false,
  } = options;

  const typeCheckFunction = isDocument
    ? isDocumentTypeSupported
    : isFileTypeSupported;
  if (!typeCheckFunction(file, allowedTypes)) {
    const typeDescription = isDocument
      ? "PDF, DOC, DOCX"
      : "JPEG, PNG, GIF, WebP";
    return {
      isValid: false,
      error: `File type not supported. Allowed types: ${typeDescription}`,
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
