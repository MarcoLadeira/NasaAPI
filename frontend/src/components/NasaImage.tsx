import React, { useState, useEffect, memo } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface NasaImageProps {
  src: string;
  alt: string;
  className?: string;
  title?: string;
  date?: string;
  description?: string;
  onDownload?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  media_type?: string;
}

const NasaImage: React.FC<NasaImageProps> = memo(({
  src,
  alt,
  className = '',
  title,
  date,
  description,
  onDownload
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const [isHovered, setIsHovered] = useState(false);

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
    <div 
      className="w-full relative group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div data-testid="loading-spinner" className="w-12 h-12 border-4 border-nasa-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Image */}
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
        } ${isHovered ? 'scale-105' : 'scale-100'} ${className}`}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
      />

      {/* Overlay with info and download button */}
      {(title || date || description || onDownload) && (
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                     transition-all duration-300 ease-in-out
                     ${isHovered ? 'opacity-100' : 'opacity-0'} flex flex-col justify-end`}
        >
          <div 
            className={`relative p-4 text-white 
                       transition-all duration-300 ease-in-out
                       ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}
          >
            {title && (
              <h3 className="text-lg font-semibold mb-1 text-white">
                {title}
              </h3>
            )}
            {date && (
              <p className="text-sm text-gray-200 mb-2">
                {date}
              </p>
            )}
            {description && (
              <p className="text-sm text-gray-300 mb-4">
                {description}
              </p>
            )}
            {onDownload && (
              <button
                onClick={onDownload}
                className="w-full flex items-center justify-center px-4 py-2 bg-nasa-blue text-white rounded-lg hover:bg-nasa-blue/80 transition-colors"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" /> Download
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg 
            className="w-12 h-12 text-gray-400 mb-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <p className="text-gray-500 text-sm text-center">
            Failed to load image
          </p>
        </div>
      )}
    </div>
  );
});

export default NasaImage; 