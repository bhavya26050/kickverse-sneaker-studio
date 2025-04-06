
import React, { useState } from "react";
import { getFallbackImage } from "@/utils/imageUtils";

interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackId?: string;
}

const FallbackImage = React.forwardRef<HTMLImageElement, FallbackImageProps>(
  ({ src, alt, fallbackId, className, ...props }, ref) => {
    const [imgSrc, setImgSrc] = useState<string>(src || "");
    const [hasError, setHasError] = useState<boolean>(false);

    const handleError = () => {
      if (!hasError) {
        const fallback = getFallbackImage(fallbackId);
        setImgSrc(fallback);
        setHasError(true);
      }
    };

    return (
      <img
        ref={ref}
        src={imgSrc}
        alt={alt || "Product image"}
        onError={handleError}
        className={className}
        {...props}
      />
    );
  }
);

FallbackImage.displayName = "FallbackImage";

export { FallbackImage };
