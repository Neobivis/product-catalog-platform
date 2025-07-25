import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { convertPrice, formatCurrency, PriceDisplay } from '@/utils/currency';
import { Language } from '@/types/product';

interface PriceFieldProps {
  productId: string;
  field: string;
  value: number;
  language: Language;
  editingField: {productId: string, field: string} | null;
  setEditingField: (field: {productId: string, field: string} | null) => void;
  onFieldEdit: (productId: string, field: string, value: string | number) => void;
}

const PriceField: React.FC<PriceFieldProps> = ({ 
  productId, 
  field, 
  value, 
  language,
  editingField,
  setEditingField,
  onFieldEdit
}) => {
  const [prices, setPrices] = useState<PriceDisplay>({ cny: value, usd: 0, rub: 0 });
  const [loading, setLoading] = useState(false);
  const isEditing = editingField?.productId === productId && editingField?.field === field;

  // Convert price when value changes
  useEffect(() => {
    const convertCurrencies = async () => {
      if (value > 0) {
        setLoading(true);
        try {
          const convertedPrices = await convertPrice(value);
          setPrices(convertedPrices);
        } catch (error) {
          console.error('Error converting currencies:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    convertCurrencies();
  }, [value]);

  if (isEditing) {
    return (
      <Input
        type="number"
        defaultValue={value}
        placeholder="Цена в юанях"
        className="h-8 text-sm"
        autoFocus
        onBlur={(e) => onFieldEdit(productId, field, parseFloat(e.target.value) || 0)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onFieldEdit(productId, field, parseFloat(e.currentTarget.value) || 0);
          }
          if (e.key === 'Escape') {
            setEditingField(null);
          }
        }}
      />
    );
  }

  return (
    <div className="flex items-center justify-between group">
      <div className="text-sm">
        {loading ? (
          <div className="flex items-center gap-2">
            <Icon name="Loader2" size={12} className="animate-spin" />
            <span>Конвертирую...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{formatCurrency(prices.cny, 'CNY')}</span>
              {language !== 'cn' && (
                <>
                  <span className="text-gray-400">/</span>
                  <span className="text-orange-500 font-medium">{formatCurrency(prices.usd, 'USD')}</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-600">{formatCurrency(prices.rub, 'RUB')}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
        onClick={() => setEditingField({ productId, field })}
      >
        <Icon name="Edit2" size={12} />
      </Button>
    </div>
  );
};

export default PriceField;