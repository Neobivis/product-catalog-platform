import React from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[product.currentImageIndex || 0]}
            alt={product.nameRu || product.nameEn}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Icon name="Package" size={48} className="text-gray-400" />
          </div>
        )}
        
        {/* Badge for availability */}
        {product.quantity > 0 ? (
          <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-md">
            В наличии
          </div>
        ) : (
          <div className="absolute top-2 left-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-md">
            Нет в наличии
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-gray-500 mb-1 truncate">
          {product.category}
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight min-h-[2.5rem]">
          {product.nameRu || product.nameEn}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Favorite Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
              title="Добавить в избранное"
            >
              <Icon name="Heart" size={16} />
            </Button>

            {/* Add to Cart Button */}
            <Button
              size="sm"
              disabled={product.quantity === 0}
              className="h-8 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
              title={product.quantity === 0 ? "Нет в наличии" : "Добавить в корзину"}
            >
              <Icon name="ShoppingCart" size={14} className="mr-1" />
              <span className="hidden sm:inline text-xs">В корзину</span>
            </Button>
          </div>
        </div>

        {/* Stock indicator */}
        {product.quantity > 0 && product.quantity <= 5 && (
          <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
            <Icon name="AlertTriangle" size={12} className="inline mr-1" />
            Осталось: {product.quantity} шт.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;