import React from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const ResetDataButton: React.FC = () => {
  const resetData = () => {
    if (window.confirm('Сбросить все данные и загрузить 25 тестовых товаров? Это действие нельзя отменить.')) {
      localStorage.removeItem('products');
      localStorage.removeItem('categories');
      window.location.reload();
    }
  };

  return (
    <Button
      onClick={resetData}
      variant="outline"
      size="sm"
      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
    >
      <Icon name="RotateCcw" size={16} className="mr-1" />
      Сбросить данные (загрузить 25 товаров)
    </Button>
  );
};

export default ResetDataButton;