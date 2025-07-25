import { useState } from 'react';
import { Product } from '@/types/product';

export const useProductOperations = (products: Product[], setProducts: React.Dispatch<React.SetStateAction<Product[]>>) => {
  const [editingField, setEditingField] = useState<{productId: string, field: string} | null>(null);
  const [showImageManager, setShowImageManager] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleFieldEdit = (productId: string, field: string, value: string | number) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, [field]: field === 'price' || field === 'quantity' ? Number(value) : value }
        : product
    ));
    
    // Only close editing field for non-translation fields
    if (!field.endsWith('En') && !field.endsWith('Cn')) {
      setEditingField(null);
    }
  };

  const handleImageNavigation = (productId: string, direction: 'prev' | 'next') => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const newIndex = direction === 'next' 
          ? (product.currentImageIndex + 1) % product.images.length
          : (product.currentImageIndex - 1 + product.images.length) % product.images.length;
        return { ...product, currentImageIndex: newIndex };
      }
      return product;
    }));
  };

  const handleFileUpload = (productId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        addImageToProduct(productId, imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageToProduct = (productId: string, imageUrl: string) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, images: [...product.images, imageUrl] }
        : product
    ));
  };

  const removeImageFromProduct = (productId: string, imageIndex: number) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const newImages = product.images.filter((_, index) => index !== imageIndex);
        // Ensure at least one image remains
        if (newImages.length === 0) {
          newImages.push('/img/b9923599-1ff7-4529-bb51-c69743d2a5bf.jpg');
        }
        // Adjust current image index if necessary
        const newCurrentIndex = product.currentImageIndex >= newImages.length 
          ? Math.max(0, newImages.length - 1)
          : product.currentImageIndex;
        
        return { 
          ...product, 
          images: newImages,
          currentImageIndex: newCurrentIndex
        };
      }
      return product;
    }));
  };

  const addImageByUrl = (productId: string) => {
    if (newImageUrl.trim()) {
      addImageToProduct(productId, newImageUrl.trim());
      setNewImageUrl('');
    }
  };

  const setCurrentImage = (productId: string, index: number) => {
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, currentImageIndex: index }
        : p
    ));
  };

  return {
    editingField,
    setEditingField,
    showImageManager,
    setShowImageManager,
    newImageUrl,
    setNewImageUrl,
    handleFieldEdit,
    handleImageNavigation,
    handleFileUpload,
    addImageByUrl,
    removeImageFromProduct,
    setCurrentImage
  };
};