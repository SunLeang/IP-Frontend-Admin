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
 * ✅ UPDATED: Upload image to MinIO storage with organized folder structure
 * @param file - The file to upload
 * @param folder - The folder path in MinIO (e.g., 'events', 'announcements', 'profiles')
 * @returns Promise with upload result
 */
export async function uploadImageToMinio(
  file: File,
  folder: string = "events" // ✅ Changed default to 'events' since most uploads are for events
): Promise<MinioUploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // ✅ Organize folder structure - don't create subfolders for individual events
    let uploadFolder = folder;

    // Map common use cases to organized folders
    switch (folder) {
      case "events":
      case "event":
        uploadFolder = "events"; // All event images go to images/events/
        break;
      case "announcements":
      case "announcement":
        uploadFolder = "announcements"; // All announcement images go to images/announcements/
        break;
      case "profiles":
      case "profile":
      case "users":
      case "user":
        uploadFolder = "profiles"; // All profile images go to images/profiles/
        break;
      case "organizations":
      case "organization":
      case "orgs":
      case "org":
        uploadFolder = "organizations"; // All org images go to images/organizations/
        break;
      default:
        uploadFolder = "events"; // ✅ Default to events instead of general
    }

    console.log(`📤 Uploading image to MinIO folder: ${uploadFolder}`);
    console.log("📤 File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
      originalFolder: folder,
      finalFolder: uploadFolder,
    });

    // Check authentication before upload
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("refreshToken");
    if (!token) {
      throw new Error("Authentication required. Please login again.");
    }

    const response = await API.post(
      `/file-upload/minio/image?folder=${uploadFolder}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      }
    );

    console.log("✅ Upload response:", response.data);

    const responseData = response.data;

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

    if (error.response?.status === 401) {
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
 * ✅ UPDATED: Upload document to MinIO storage with organized folder structure
 * @param file - The file to upload
 * @param folder - The folder path in MinIO
 * @returns Promise with upload result
 */
export async function uploadDocumentToMinio(
  file: File,
  folder: string = "cvs" // ✅ Changed default to 'cvs'
): Promise<MinioUploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // ✅ Organize document folder structure
    let uploadFolder = folder;

    switch (folder) {
      case "cvs":
      case "cv":
      case "resume":
      case "resumes":
        uploadFolder = "cvs"; // ✅ All CVs go to documents/cvs/
        break;
      case "certificates":
      case "certificate":
        uploadFolder = "certificates"; // All certificates go to documents/certificates/
        break;
      case "reports":
      case "report":
        uploadFolder = "reports"; // All reports go to documents/reports/
        break;
      default:
        uploadFolder = "cvs"; // ✅ Default to cvs instead of general
    }

    console.log(`📤 Uploading document to MinIO folder: ${uploadFolder}`);
    console.log("📤 File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
      originalFolder: folder,
      finalFolder: uploadFolder,
    });

    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("refreshToken");
    if (!token) {
      throw new Error("Authentication required. Please login again.");
    }

    const response = await API.post(
      `/file-upload/minio/document?folder=${uploadFolder}`,
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

/**
 * ✅ UPDATED: Get MinIO image URL - events default
 * @param filename - The filename to get URL for
 * @returns Full URL to the image
 */
export function getMinioImageUrl(filename: string): string {
  if (!filename) return "/assets/images/placeholder.png";

  if (filename.startsWith("http")) return filename;

  const baseUrl = process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000";

  // ✅ Handle different filename formats for organized structure
  let cleanFilename = filename;

  // Remove leading slash if present
  if (cleanFilename.startsWith("/")) {
    cleanFilename = cleanFilename.substring(1);
  }

  // ✅ Expected formats:
  // - "events/uuid.jpg" (already has folder - use as is)
  // - "announcements/uuid.jpg" (already has folder - use as is)
  // - "profiles/uuid.jpg" (already has folder - use as is)
  // - "uuid.jpg" (bare filename - assume events folder)

  let finalPath = cleanFilename;

  // Remove bucket prefix if present
  if (finalPath.startsWith("images/")) {
    finalPath = finalPath.substring(7); // Remove "images/" prefix
  }

  // ✅ If no folder prefix, assume events (most common)
  if (!finalPath.includes("/")) {
    finalPath = `events/${finalPath}`;
  }

  const finalUrl = `${baseUrl}/images/${finalPath}`;

  console.log("🔗 Image URL Generation Debug:", {
    original: filename,
    cleaned: cleanFilename,
    finalPath: finalPath,
    finalUrl: finalUrl,
  });

  return finalUrl;
}

/**
 * ✅ UPDATED: Get MinIO document URL with correct cvs/ folder
 * @param filename - The filename from database (could be old or new format)
 * @returns Full URL to the document
 */
export function getMinioDocumentUrl(filename: string): string {
  if (!filename) return "";

  if (filename.startsWith("http")) return filename;

  const baseUrl = process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000";

  // ✅ Handle different path formats
  let cleanPath = filename;

  // Remove leading slash if present
  if (cleanPath.startsWith("/")) {
    cleanPath = cleanPath.substring(1);
  }

  // ✅ Check if this is an old path format from database
  if (cleanPath.startsWith("uploads/cv/")) {
    // Old format: uploads/cv/cv.pdf -> Skip (file doesn't exist in MinIO)
    console.warn(
      "⚠️ Old path format detected - file may not exist in MinIO:",
      filename
    );
    return ""; // Return empty string to indicate file not available
  }

  // ✅ Handle MinIO path formats for organized structure
  let finalPath = cleanPath;

  // Remove bucket prefix if duplicated
  if (finalPath.startsWith("documents/")) {
    finalPath = finalPath.substring(10);
  }

  // ✅ Handle correct cvs/ folder structure
  if (cleanPath.startsWith("cvs/")) {
    // Already correct format: cvs/uuid.pdf
    finalPath = cleanPath;
  } else if (cleanPath.startsWith("cv/")) {
    // Old single cv/ format, convert to cvs/
    finalPath = cleanPath.replace("cv/", "cvs/");
  } else if (!cleanPath.includes("/")) {
    // Just filename, add cvs/ prefix
    finalPath = `cvs/${cleanPath}`;
  }

  const finalUrl = `${baseUrl}/documents/${finalPath}`;

  console.log("🔗 Document URL Generation Debug:", {
    original: filename,
    cleaned: cleanPath,
    finalPath: finalPath,
    finalUrl: finalUrl,
    isOldFormat: filename.includes("uploads/cv/"),
    expectedMinIOPath: `documents/${finalPath}`,
  });

  return finalUrl;
}

/**
 * ✅ UPDATED: Proxy through backend with correct cvs/ folder
 * @param filename - The filename to get URL for
 * @returns Proxied URL through backend
 */
export function getMinioDocumentProxyUrl(filename: string): string {
  if (!filename) return "";

  if (filename.startsWith("http")) return filename;

  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100/api";

  // ✅ Handle old path format - return empty for old uploads
  let cleanPath = filename;
  if (cleanPath.startsWith("/")) {
    cleanPath = cleanPath.substring(1);
  }

  if (cleanPath.startsWith("uploads/cv/")) {
    console.warn(
      "⚠️ Old path format detected for proxy - file may not exist:",
      filename
    );
    return ""; // Return empty string for old paths
  }

  // Handle MinIO path formats
  let finalPath = cleanPath;

  // Remove bucket prefix if duplicated
  if (finalPath.startsWith("documents/")) {
    finalPath = finalPath.substring(10);
  }

  // ✅ Handle correct cvs/ folder structure
  if (cleanPath.startsWith("cvs/")) {
    finalPath = cleanPath;
  } else if (cleanPath.startsWith("cv/")) {
    finalPath = cleanPath.replace("cv/", "cvs/");
  } else if (!cleanPath.includes("/")) {
    finalPath = `cvs/${cleanPath}`;
  }

  const proxyUrl = `${backendUrl}/file-upload/minio/document/view/${encodeURIComponent(
    finalPath
  )}`;

  console.log("🔗 Proxy URL Generation Debug:", {
    original: filename,
    finalPath: finalPath,
    proxyUrl: proxyUrl,
    isOldFormat: filename.includes("uploads/cv/"),
  });

  return proxyUrl;
}

/**
 * ✅ UPDATED: Get MinIO thumbnail URL with organized folder structure
 * @param filename - The filename to get thumbnail URL for
 * @returns Full URL to the thumbnail
 */
export function getMinioThumbnailUrl(filename: string): string {
  if (!filename) return "/assets/images/placeholder.png";

  if (filename.startsWith("http")) return filename;

  const baseUrl = process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000";

  let cleanFilename = filename;

  // Remove leading slash if present
  if (cleanFilename.startsWith("/")) {
    cleanFilename = cleanFilename.substring(1);
  }

  // Remove bucket prefix if present
  if (cleanFilename.startsWith("thumbnails/")) {
    cleanFilename = cleanFilename.substring(11); // Remove "thumbnails/" prefix
  }

  // If no folder prefix, assume events (most common)
  if (!cleanFilename.includes("/")) {
    cleanFilename = `events/${cleanFilename}`;
  }

  return `${baseUrl}/thumbnails/${cleanFilename}`;
}

/**
 * ✅ UPDATED: Get correct URL based on file type with fallback to proxy
 * @param filename - The filename to get URL for
 * @param isDocument - Whether this is a document or image
 * @param useProxy - Whether to use backend proxy for secure access
 * @returns Full URL to the file
 */
export function getMinioFileUrl(
  filename: string,
  isDocument: boolean = false,
  useProxy: boolean = false
): string {
  if (isDocument) {
    return useProxy
      ? getMinioDocumentProxyUrl(filename)
      : getMinioDocumentUrl(filename);
  } else {
    return getMinioImageUrl(filename);
  }
}

/**
 * ✅ UPDATED: Helper function to normalize document paths with correct cvs/ folder
 * @param filename - Raw filename from database
 * @returns Normalized path for MinIO access or empty string if old format
 */
export function normalizeDocumentPath(filename: string): string {
  if (!filename) return "";

  let normalized = filename;

  // Remove leading slash
  if (normalized.startsWith("/")) {
    normalized = normalized.substring(1);
  }

  // ✅ Check for old format - return empty string
  if (normalized.startsWith("uploads/cv/")) {
    return ""; // Old format - file doesn't exist in MinIO
  }

  // Remove bucket prefix if present
  if (normalized.startsWith("documents/")) {
    normalized = normalized.substring(10);
  }

  // ✅ Handle MinIO formats with correct cvs/ folder
  if (normalized.startsWith("cvs/")) {
    // Already correct format
    return normalized;
  } else if (normalized.startsWith("cv/")) {
    // Convert old cv/ to cvs/
    return normalized.replace("cv/", "cvs/");
  } else if (!normalized.includes("/")) {
    // Just filename, add cvs/ prefix
    return `cvs/${normalized}`;
  }

  return normalized;
}

/**
 * ✅ UPDATED: Helper function to normalize image paths with events default
 * @param filename - Raw filename from database
 * @param category - Category of image (events, announcements, profiles, etc.)
 * @returns Normalized path for MinIO access
 */
export function normalizeImagePath(
  filename: string,
  category: string = "events"
): string {
  if (!filename) return "";

  let normalized = filename;

  // Remove leading slash
  if (normalized.startsWith("/")) {
    normalized = normalized.substring(1);
  }

  // Remove bucket prefix if present
  if (normalized.startsWith("images/")) {
    normalized = normalized.substring(7);
  }

  // ✅ If already has folder structure, use as is
  if (normalized.includes("/")) {
    return normalized;
  }

  // ✅ Add folder prefix based on category
  let folder = category;
  switch (category) {
    case "event":
    case "events":
      folder = "events";
      break;
    case "announcement":
    case "announcements":
      folder = "announcements";
      break;
    case "profile":
    case "profiles":
    case "user":
    case "users":
      folder = "profiles";
      break;
    case "organization":
    case "organizations":
    case "org":
    case "orgs":
      folder = "organizations";
      break;
    default:
      folder = "events"; // Default to events
  }
  return `${folder}/${normalized}`;
}

/**
 * ✅ NEW: Check if a file path is in old format
 * @param filename - The filename to check
 * @returns True if it's an old format that doesn't exist in MinIO
 */
export function isOldPathFormat(filename: string): boolean {
  if (!filename) return false;

  const cleanPath = filename.startsWith("/") ? filename.substring(1) : filename;
  return cleanPath.startsWith("uploads/cv/");
}

/**
 * ✅ UPDATED: Upload multiple files with organized folder structure
 * @param files - Array of files to upload
 * @param folder - Folder category (events, announcements, profiles, etc.)
 * @returns Promise with upload results
 */
export async function uploadMultipleFiles(
  files: File[],
  folder: string = "events"
): Promise<MinioUploadResponse[]> {
  try {
    const uploadPromises = files.map((file) =>
      uploadImageToMinio(file, folder)
    );
    const results = await Promise.all(uploadPromises);

    console.log(
      `✅ Successfully uploaded ${results.length} files to ${folder} folder`
    );
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

/**
 * ✅ UPDATED: Helper functions for specific use cases
 */

// Event-specific upload function - all event images go to images/events/
export async function uploadEventImage(
  file: File
): Promise<MinioUploadResponse> {
  return uploadImageToMinio(file, "events");
}

// Announcement-specific upload function
export async function uploadAnnouncementImage(
  file: File
): Promise<MinioUploadResponse> {
  return uploadImageToMinio(file, "announcements");
}

// Profile-specific upload function
export async function uploadProfileImage(
  file: File
): Promise<MinioUploadResponse> {
  return uploadImageToMinio(file, "profiles");
}

// Organization-specific upload function
export async function uploadOrganizationImage(
  file: File
): Promise<MinioUploadResponse> {
  return uploadImageToMinio(file, "organizations");
}

// ✅ UPDATED: CV-specific upload function - goes to documents/cvs/
export async function uploadCVDocument(
  file: File
): Promise<MinioUploadResponse> {
  return uploadDocumentToMinio(file, "cvs");
}
