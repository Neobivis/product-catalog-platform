import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Product } from '@/types/product';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onPrevImage: () => void;
  onNextImage: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  product,
  onPrevImage,
  onNextImage
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrevImage();
      if (e.key === 'ArrowRight') onNextImage();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onPrevImage, onNextImage]);

  if (!isOpen || !product) return null;

  const currentImage = product.images[product.currentImageIndex];
  const hasMultipleImages = product.images.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Close button */}
      <Button
        onClick={onClose}
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 rounded-full w-10 h-10 p-0"
      >
        <Icon name="X" size={20} />
      </Button>

      {/* Previous image button */}
      {hasMultipleImages && (
        <Button
          onClick={onPrevImage}
          variant="ghost"
          size="sm"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full w-12 h-12 p-0"
        >
          <Icon name="ChevronLeft" size={24} />
        </Button>
      )}

      {/* Next image button */}
      {hasMultipleImages && (
        <Button
          onClick={onNextImage}
          variant="ghost"
          size="sm"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full w-12 h-12 p-0"
        >
          <Icon name="ChevronRight" size={24} />
        </Button>
      )}

      {/* Main image */}
      <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        <img
          src={currentImage}
          alt={product.nameRu || product.nameEn}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
        
        {/* Image counter */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {product.currentImageIndex + 1} / {product.images.length}
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="absolute bottom-4 left-4 bg-black/60 text-white p-4 rounded-lg max-w-sm">
        <h3 className="font-semibold text-lg mb-1">
          {product.nameRu || product.nameEn}
        </h3>
        <p className="text-sm opacity-90">SKU: {product.sku}</p>
        <p className="text-sm opacity-90">₽{product.price.toLocaleString()}</p>
      </div>

      {/* Thumbnails */}
      {hasMultipleImages && (
        <div className="absolute bottom-4 right-4 flex gap-2 bg-black/60 p-2 rounded-lg">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => onNextImage()}
              className={`w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                index === product.currentImageIndex 
                  ? 'border-white' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={image}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Click overlay to close */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={onClose}
      />
    </div>
  );
};

export default ImageModal;