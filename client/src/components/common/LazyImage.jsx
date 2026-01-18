import React, { useState } from "react";

const LazyImage = ({ src, alt, className, style }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Placeholder / Blur Effect */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-in-out transform ${
          isLoaded
            ? "opacity-100 blur-0 scale-100"
            : "opacity-0 blur-lg scale-95"
        }`}
      />
    </div>
  );
};

export default LazyImage;
