"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface SmartImageProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function SmartImage({
  src,
  fallbackSrc,
  alt,
  width,
  height,
  fill = false,
  className,
  sizes,
  priority = false,
}: SmartImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(true);
    } else {
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (fill) {
    return (
      <>
        {isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}
        <Image
          src={currentSrc}
          alt={alt}
          fill
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          onError={handleError}
          onLoad={handleLoad}
          sizes={sizes}
          priority={priority}
        />
      </>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <Skeleton
          className={cn("absolute inset-0", `w-${width} h-${height}`)}
        />
      )}

      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onError={handleError}
        onLoad={handleLoad}
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}
