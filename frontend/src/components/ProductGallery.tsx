import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductGalleryProps {
  mainImage: string;
  gallery?: string[];
  productName: string;
}

export const ProductGallery = ({ mainImage, gallery = [], productName }: ProductGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const allImages = gallery && gallery.length > 0 ? [mainImage, ...gallery] : [mainImage];

  // Auto-rotate images every 5 seconds when not paused
  useEffect(() => {
    if (isPaused || allImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, allImages.length]);

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setIsPaused(true);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    setIsPaused(true);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
    setIsPaused(true);
  };

  const handleImageFocus = () => {
    setIsPaused(true);
  };

  const handleImageBlur = () => {
    setIsPaused(false);
  };

  const currentImage = allImages[currentImageIndex];

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className="relative rounded-xl overflow-hidden bg-secondary flex items-center justify-center max-w-lg mx-auto"
        style={{ aspectRatio: '1/1' }}
        onMouseEnter={handleImageFocus}
        onMouseLeave={handleImageBlur}
        onTouchStart={handleImageFocus}
        onTouchEnd={handleImageBlur}
        data-testid="gallery-main-image"
        tabIndex={0}
        role="region"
        aria-label={`Image principale: ${productName}`}
      >
        <img
          src={currentImage}
          alt={`${productName} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-contain transition-all duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />

        {/* Navigation arrows - visible on hover */}
        {allImages.length > 1 && (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white"
              onClick={goToPrevious}
              data-testid="button-gallery-prev"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white"
              onClick={goToNext}
              data-testid="button-gallery-next"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Auto-rotation indicator */}
        {allImages.length > 1 && !isPaused && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white bg-black/50 px-2 py-1 rounded">
            Auto-rotation...
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 justify-center overflow-x-auto">
          {allImages.map((image, index) => (
            <button
              key={index}
              className={`flex-shrink-0 w-14 h-14 rounded overflow-hidden transition-all duration-200 ${
                index === currentImageIndex
                  ? 'ring-2 ring-primary scale-105'
                  : 'opacity-60 hover:opacity-100'
              }`}
              onClick={() => goToImage(index)}
              data-testid={`button-gallery-thumbnail-${index}`}
              aria-label={`Image ${index + 1}`}
            >
              <img
                src={image}
                alt={`Miniature ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
