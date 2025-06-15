import React, { useState, useEffect } from 'react';

interface NasaImageProps {
  src: string;
  alt: string;
  className?: string;
  title?: string;
  date?: string;
  description?: string;
}

const NasaImage: React.FC<NasaImageProps> = ({
  src,
  alt,
  className = '',
  title,
  date,
  description
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setImageSrc(src);
  }, [src]);

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setImageSrc('/placeholder-image.jpg');
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nasa-blue"></div>
        </div>
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        loading="lazy"
      />

      {(title || date || description) && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          {date && <p className="text-sm mb-1">{date}</p>}
          {description && <p className="text-sm">{description}</p>}
        </div>
      )}
    </div>
  );
};

export default NasaImage; 