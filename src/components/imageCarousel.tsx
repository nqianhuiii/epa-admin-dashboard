// components/ImageCarousel.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageCarouselProps {
  images: string[];
  alt?: string;
  className?: string;
  imageClassName?: string;
  showControls?: boolean;
  showDots?: boolean;
  showCounter?: boolean;
  width?: number;
  height?: number;
  onImageClick?: (index: number) => void;
}

export default function ImageCarousel({
  images,
  alt = "Image",
  className = "",
  imageClassName = "",
  showControls = true,
  showDots = true,
  showCounter = true,
  width = 600,
  height = 400,
  onImageClick
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(currentIndex);
    }
  };

  const isMultipleImages = images.length > 1;

  return (
    <div className={`relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden ${className}`}>
      <Image
        src={images[currentIndex]}
        alt={`${alt} ${currentIndex + 1}`}
        width={width}
        height={height}
        className={`w-full h-auto object-cover ${onImageClick ? 'cursor-pointer' : ''} ${imageClassName}`}
        onClick={handleImageClick}
      />
      
      {isMultipleImages && (
        <>
          {/* Counter */}
          {showCounter && (
            <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-sm">
              {currentIndex + 1}/{images.length}
            </div>
          )}
          
          {/* Navigation Controls */}
          {showControls && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                aria-label="Next image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {/* Dots Indicator */}
          {showDots && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-2 h-2 rounded-full transition-opacity ${
                    index === currentIndex 
                      ? 'bg-white' 
                      : 'bg-white bg-opacity-50'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}