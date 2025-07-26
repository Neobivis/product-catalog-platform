import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onUpdate?: (updatedProduct: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product>(product);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedProduct);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProduct(product);
    setIsEditing(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg border-2 border-blue-200 shadow-lg p-4 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Редактирование товара</h3>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Icon name="Check" size={16} className="mr-1" />
              Сохранить
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
            >
              <Icon name="X" size={16} className="mr-1" />
              Отмена
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main Info */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название (EN)
              </label>
              <Input
                value={editedProduct.nameEn || ''}
                onChange={(e) => setEditedProduct({ ...editedProduct, nameEn: e.target.value })}
                placeholder="English name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название (RU)
              </label>
              <Input
                value={editedProduct.nameRu || ''}
                onChange={(e) => setEditedProduct({ ...editedProduct, nameRu: e.target.value })}
                placeholder="Русское название"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Категория
              </label>
              <Input
                value={editedProduct.category || ''}
                onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                placeholder="Категория товара"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <Textarea
                value={editedProduct.description || ''}
                onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                placeholder="Описание товара"
                rows={3}
              />
            </div>
          </div>

          {/* Pricing & Details */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Цена (¥)
                </label>
                <Input
                  type="number"
                  value={editedProduct.price || ''}
                  onChange={(e) => setEditedProduct({ ...editedProduct, price: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Количество
                </label>
                <Input
                  type="number"
                  value={editedProduct.quantity || ''}
                  onChange={(e) => setEditedProduct({ ...editedProduct, quantity: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ТН ВЭД код
              </label>
              <Input
                value={editedProduct.tnved || ''}
                onChange={(e) => setEditedProduct({ ...editedProduct, tnved: e.target.value })}
                placeholder="ТН ВЭД код"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Материал
              </label>
              <Input
                value={editedProduct.material || ''}
                onChange={(e) => setEditedProduct({ ...editedProduct, material: e.target.value })}
                placeholder="Материал изготовления"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Назначение
              </label>
              <Input
                value={editedProduct.purpose || ''}
                onChange={(e) => setEditedProduct({ ...editedProduct, purpose: e.target.value })}
                placeholder="Назначение товара"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Для кого
              </label>
              <Input
                value={editedProduct.forWhom || ''}
                onChange={(e) => setEditedProduct({ ...editedProduct, forWhom: e.target.value })}
                placeholder="Целевая аудитория"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center p-3 border-b border-gray-100">
        <span className="text-xs text-gray-500 font-medium">ID: {product.id}</span>
        <Button
          onClick={() => setIsEditing(true)}
          variant="ghost"
          size="sm"
          className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Icon name="Edit3" size={14} className="mr-1" />
          Редактировать
        </Button>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[product.currentImageIndex || 0]}
            alt={product.nameRu || product.nameEn}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Icon name="Package" size={48} className="text-gray-400" />
          </div>
        )}
        
        {/* Availability Badge */}
        <div className="absolute top-2 left-2">
          {product.quantity > 0 ? (
            <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-md">
              В наличии: {product.quantity}
            </div>
          ) : (
            <div className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-md">
              Нет в наличии
            </div>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
          {product.category}
        </div>

        {/* Names */}
        <div>
          <h3 className="font-semibold text-gray-900 text-sm mb-1">
            {product.nameRu || product.nameEn}
          </h3>
          {product.nameEn && product.nameRu && (
            <p className="text-xs text-gray-500">{product.nameEn}</p>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="text-lg font-bold text-blue-600">
          {formatPrice(product.price)}
        </div>

        {/* Additional Fields */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          {product.tnved && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">ТН ВЭД:</span>
              <span className="font-mono">{product.tnved}</span>
            </div>
          )}
          {product.material && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Материал:</span>
              <span>{product.material}</span>
            </div>
          )}
          {product.purpose && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Назначение:</span>
              <span>{product.purpose}</span>
            </div>
          )}
          {product.forWhom && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Для кого:</span>
              <span>{product.forWhom}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
            title="Добавить в избранное"
          >
            <Icon name="Heart" size={16} />
          </Button>

          <Button
            size="sm"
            disabled={product.quantity === 0}
            className="h-8 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
            title={product.quantity === 0 ? "Нет в наличии" : "Добавить в корзину"}
          >
            <Icon name="ShoppingCart" size={14} className="mr-1" />
            <span className="text-xs">В корзину</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;