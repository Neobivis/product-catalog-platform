import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Product } from '@/types/product';

interface ImageManagerProps {
  productId: string;
  products: Product[];
  showImageManager: string | null;
  setShowImageManager: (id: string | null) => void;
  newImageUrl: string;
  setNewImageUrl: (url: string) => void;
  translations: any;
  onFileUpload: (productId: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddImageByUrl: (productId: string) => void;
  onRemoveImage: (productId: string, index: number) => void;
  onSetCurrentImage: (productId: string, index: number) => void;
}

const ImageManager: React.FC<ImageManagerProps> = ({
  productId,
  products,
  showImageManager,
  setShowImageManager,
  newImageUrl,
  setNewImageUrl,
  translations: t,
  onFileUpload,
  onAddImageByUrl,
  onRemoveImage,
  onSetCurrentImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const product = products.find(p => p.id === productId);
  
  if (!product) return null;

  return (
    <Dialog open={showImageManager === productId} onOpenChange={() => setShowImageManager(null)}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.imageManagement} - {product.nameEn}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Add Images Section */}
          <div className="space-y-4">
            <h4 className="font-semibold">{t.addImages}</h4>
            
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">{t.uploadFile}</TabsTrigger>
                <TabsTrigger value="url">{t.byLink}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.svg"
                    onChange={(e) => onFileUpload(productId, e)}
                    className="hidden"
                  />
                  <Icon name="Upload" size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">{t.dragDrop}</p>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                  >
                    {t.selectFile}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="url" className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/image.jpg или .svg"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={() => onAddImageByUrl(productId)}>
                    <Icon name="Plus" size={16} />
                    {t.add}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Current Images */}
          <div className="space-y-4">
            <h4 className="font-semibold">{t.currentImages} ({product.images.length})</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    index === product.currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                  }`}>
                    <img
                      src={image}
                      alt={`${product.nameEn} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Image Controls */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onSetCurrentImage(productId, index)}
                      disabled={index === product.currentImageIndex}
                    >
                      <Icon name="Eye" size={14} />
                    </Button>
                    
                    {product.images.length > 1 && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onRemoveImage(productId, index)}
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    )}
                  </div>
                  
                  {/* Main Image Badge */}
                  {index === product.currentImageIndex && (
                    <Badge className="absolute top-2 left-2">
                      {t.main}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageManager;