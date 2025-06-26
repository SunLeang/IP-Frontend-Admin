"use client";

import { useState } from "react";
import { Download, Eye, FileText, X, RefreshCw } from "lucide-react";
import {
  getMinioDocumentUrl,
  getMinioDocumentProxyUrl,
} from "@/app/(api)/file_upload_api";

interface PDFViewerProps {
  filename: string;
  onClose: () => void;
  applicantName?: string;
}

export default function PDFViewer({
  filename,
  onClose,
  applicantName,
}: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useProxy, setUseProxy] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // ✅ Get both URLs for fallback
  const directUrl = getMinioDocumentUrl(filename);
  const proxyUrl = getMinioDocumentProxyUrl(filename);
  const pdfUrl = useProxy ? proxyUrl : directUrl;

  console.log("🔍 PDF Viewer Debug:", {
    filename,
    useProxy,
    directUrl,
    proxyUrl,
    pdfUrl,
    applicantName,
    retryCount,
  });

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `CV_${applicantName || "volunteer"}_${filename
      .split("/")
      .pop()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
    console.log(
      "✅ PDF loaded successfully with:",
      useProxy ? "proxy" : "direct",
      "URL"
    );
  };

  const handleError = () => {
    setIsLoading(false);
    console.error("❌ PDF loading failed for URL:", pdfUrl);

    // ✅ Auto-retry with different URL mode
    if (retryCount === 0) {
      setError(null);
      setIsLoading(true);
      setUseProxy(!useProxy);
      setRetryCount(1);
      console.log("🔄 Retrying with", !useProxy ? "proxy" : "direct", "URL...");
      return;
    }

    setError(
      `Failed to load PDF. Tried both direct and proxy access. ${
        useProxy ? "Proxy" : "Direct"
      } URL: ${pdfUrl}`
    );
  };

  const manualRetry = () => {
    setError(null);
    setIsLoading(true);
    setUseProxy(!useProxy);
    setRetryCount((prev) => prev + 1);
  };

  // ✅ Don't render if no valid URL
  if (!directUrl && !proxyUrl) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Document Available
          </h3>
          <p className="text-gray-600 mb-4">
            The document URL is not available or invalid.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">
              {applicantName ? `${applicantName}'s CV` : "CV Document"}
            </h2>
            {/* ✅ Show access mode indicator */}
            <span
              className={`px-2 py-1 text-xs rounded ${
                useProxy
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {useProxy ? "Proxy" : "Direct"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* ✅ Retry button */}
            {error && (
              <button
                onClick={manualRetry}
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            )}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading PDF...</p>
                <p className="text-xs text-gray-500 mt-2">
                  Using {useProxy ? "proxy" : "direct"} access
                </p>
                <p className="text-xs text-gray-400 mt-1 break-all max-w-md">
                  {pdfUrl}
                </p>
              </div>
            </div>
          )}

          {error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-2xl px-4">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Unable to Display PDF
                </h3>
                <p className="text-gray-600 mb-2">{error}</p>
                <div className="bg-gray-100 p-3 rounded text-xs text-left mb-4">
                  <p>
                    <strong>Direct URL:</strong>{" "}
                    <span className="break-all">{directUrl}</span>
                  </p>
                  <p>
                    <strong>Proxy URL:</strong>{" "}
                    <span className="break-all">{proxyUrl}</span>
                  </p>
                  <p>
                    <strong>Current:</strong>{" "}
                    <span className="break-all">{pdfUrl}</span>
                  </p>
                </div>
                <div className="flex gap-2 justify-center flex-wrap">
                  <button
                    onClick={manualRetry}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try {useProxy ? "Direct" : "Proxy"}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Instead
                  </button>
                  <button
                    onClick={() => window.open(pdfUrl, "_blank")}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Open in New Tab
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              key={`${pdfUrl}-${retryCount}`}
              src={`${pdfUrl}#toolbar=1&view=FitH`}
              className="w-full h-full border-0"
              onLoad={handleLoad}
              onError={handleError}
              title={`CV - ${applicantName || "Volunteer"}`}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            File: {filename} • Mode: {useProxy ? "Proxy" : "Direct"} •
            <button
              onClick={() => window.open(pdfUrl, "_blank")}
              className="text-blue-500 hover:underline ml-1"
            >
              Open in new tab
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
