"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Utensils } from "lucide-react";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80";

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  className,
  ...rest
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  return (
    <>
      <Image
        {...rest}
        src={hasError ? fallbackSrc : imgSrc}
        alt={alt}
        className={className}
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
          }
        }}
      />
      {hasError && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-300 pointer-events-none"
        >
          <Utensils className="w-6 h-6 opacity-40" />
        </div>
      )}
    </>
  );
}
