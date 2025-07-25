import React from 'react';
import { Button } from '@/components/ui/button';
import { Language } from '@/types/product';

interface LanguageToggleProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, onLanguageChange }) => (
  <div className="flex items-center gap-2">
    <Button
      variant={language === 'ru' ? 'default' : 'outline'}
      size="sm"
      onClick={() => onLanguageChange('ru')}
      className="flex items-center gap-1"
    >
      🇷🇺 RU
    </Button>
    <Button
      variant={language === 'cn' ? 'default' : 'outline'}
      size="sm"
      onClick={() => onLanguageChange('cn')}
      className="flex items-center gap-1"
    >
      🇨🇳 CN
    </Button>
  </div>
);

export default LanguageToggle;