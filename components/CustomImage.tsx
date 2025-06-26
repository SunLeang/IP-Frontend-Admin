"use client";

import Image from "next/image";
import { useState } from "react";
import { getMinioImageUrl } from "@/app/(api)/file_upload_api";

interface CustomImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
}

export default function CustomImage({
  src,
  alt,
  width = 400,
  height = 200,
  className = "",
  fallbackSrc = "/assets/images/placeholder.png",
  priority = false,
  fill = false,
  sizes,
  quality = 75,
}: CustomImageProps) {
  const [imgSrc, setImgSrc] = useState(
    src ? getMinioImageUrl(src) : fallbackSrc
  );
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  // Check if the image source is from MinIO (external)
  const isMinioImage =
    imgSrc.startsWith("http://localhost:9000") || imgSrc.startsWith("https://");

  // Use regular img tag for MinIO images, Next.js Image for local images
  if (isMinioImage) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onError={handleError}
        style={
          fill
            ? { width: "100%", height: "100%", objectFit: "cover" }
            : { width: width, height: height }
        }
      />
    );
  }

  // Use Next.js Image for local images
  const imageProps = {
    src: imgSrc,
    alt,
    className,
    onError: handleError,
    priority,
    quality,
    ...(fill ? { fill: true, sizes: sizes || "100vw" } : { width, height }),
  };

  return <Image {...imageProps} />;
}
