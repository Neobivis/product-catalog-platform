import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Language } from '@/types/product';

interface MultiLanguageTextFieldProps {
  productId: string;
  field: string;
  valueRu: string;
  valueEn: string;
  valueCn: string;
  language: Language;
  placeholder?: string;
  editingField: {productId: string, field: string} | null;
  setEditingField: (field: {productId: string, field: string} | null) => void;
  onFieldEdit: (productId: string, field: string, value: string | number) => void;
}

const MultiLanguageTextField: React.FC<MultiLanguageTextFieldProps> = ({
  productId,
  field,
  valueRu,
  valueEn,
  valueCn,
  language,
  placeholder = 'Добавить описание...',
  editingField,
  setEditingField,
  onFieldEdit
}) => {
  const [viewLanguage, setViewLanguage] = useState<'ru' | 'en' | 'cn'>('ru');
  const [isExpanded, setIsExpanded] = useState(false);
  const [textValue, setTextValue] = useState(valueRu);
  const isEditing = editingField?.productId === productId && editingField?.field === field;

  // Get available view languages based on current site language
  const getAvailableLanguages = () => {
    if (language === 'cn') {
      return [
        { code: 'en' as const, label: '🇺🇸 EN', value: valueEn },
        { code: 'cn' as const, label: '🇨🇳 中文', value: valueCn }
      ];
    }
    return [
      { code: 'ru' as const, label: '🇷🇺 RU', value: valueRu },
      { code: 'en' as const, label: '🇺🇸 EN', value: valueEn },
      { code: 'cn' as const, label: '🇨🇳 中文', value: valueCn }
    ];
  };

  // Check if translation tab should be highlighted red (Russian has text but translation is empty)
  const isTranslationOutdated = (langCode: 'en' | 'cn') => {
    if (!valueRu.trim()) return false; // No Russian text, no need for translation
    
    if (langCode === 'en') {
      return !valueEn.trim(); // Russian has text but English is empty
    } else {
      return !valueCn.trim(); // Russian has text but Chinese is empty
    }
  };

  const availableLanguages = getAvailableLanguages();
  const currentValue = availableLanguages.find(lang => lang.code === viewLanguage)?.value || '';



  // Ensure viewLanguage is available
  React.useEffect(() => {
    const isCurrentLangAvailable = availableLanguages.some(lang => lang.code === viewLanguage);
    if (!isCurrentLangAvailable) {
      setViewLanguage(availableLanguages[0].code);
    }
  }, [language, availableLanguages, viewLanguage]);

  // Function to truncate text to approximately 4 sentences
  const truncateText = (text: string): { truncated: string; needsTruncation: boolean } => {
    if (!text) return { truncated: '', needsTruncation: false };
    
    const sentences = text.split(/([.!?]+\s*)/).filter(Boolean);
    const truncatedParts = sentences.slice(0, 8);
    const truncated = truncatedParts.join('');
    const needsTruncation = sentences.length > 8;
    
    return { truncated, needsTruncation };
  };

  const { truncated, needsTruncation } = truncateText(currentValue);
  const displayText = isExpanded ? currentValue : truncated;

  const handleSave = (newRuText: string) => {
    // Save Russian text
    onFieldEdit(productId, field, newRuText);
    
    // If Russian text was edited or cleared, clear translations
    if (newRuText.trim() !== valueRu.trim()) {
      onFieldEdit(productId, `${field}En`, '');
      onFieldEdit(productId, `${field}Cn`, '');
    }
  };



  // Update textValue when valueRu changes or editing starts
  React.useEffect(() => {
    if (isEditing) {
      setTextValue(valueRu);
    }
  }, [isEditing, valueRu]);

  const handleSaveClick = () => {
    handleSave(textValue);
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  if (isEditing && viewLanguage === 'ru') {

    return (
      <div className="w-full">
        <div className="flex items-center gap-2 mb-3">
          {availableLanguages.map((lang) => (
            <Button
              key={lang.code}
              variant={viewLanguage === lang.code ? 'default' : 'outline'}
              size="sm"
              className="h-6 px-2 text-xs"
              disabled={lang.code !== 'ru'}
              onClick={() => setViewLanguage(lang.code)}
            >
              {lang.label}
            </Button>
          ))}
        </div>
        
        <div className="relative">
          <Textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder={placeholder}
            className="min-h-[120px] text-sm resize-none pr-20"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleCancel();
              }
              if (e.key === 'Enter' && e.ctrlKey) {
                handleSaveClick();
              }
            }}
          />
          
          {/* Save and Cancel buttons */}
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleSaveClick}
              title="Сохранить"
            >
              <Icon name="Check" size={12} className="text-green-600" />
            </Button>
            <Button
              variant="ghost" 
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleCancel}
              title="Отменить"
            >
              <Icon name="X" size={12} className="text-red-600" />
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mt-1">
          Ctrl+Enter для сохранения, Escape для отмены. Вкладки EN/CN будут подсвечены красным, если требуется обновление перевода.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full group">
      <div className="flex items-center gap-2 mb-3">
        {availableLanguages.map((lang) => {
          const isOutdated = (lang.code === 'en' || lang.code === 'cn') && isTranslationOutdated(lang.code);
          return (
            <Button
              key={lang.code}
              variant={viewLanguage === lang.code ? 'default' : 'outline'}
              size="sm"
              className={`h-6 px-2 text-xs ${
                isOutdated 
                  ? 'border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700' 
                  : ''
              }`}
              onClick={() => setViewLanguage(lang.code)}
            >
              {lang.label}
            </Button>
          );
        })}
      </div>
      
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {currentValue ? (
            <div className="text-sm leading-relaxed">
              <div className="whitespace-pre-wrap break-words">
                {displayText}
              </div>
              {needsTruncation && !isExpanded && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 mt-2 text-blue-600 hover:text-blue-800"
                  onClick={() => setIsExpanded(true)}
                >
                  <Icon name="ChevronDown" size={14} className="mr-1" />
                  Показать еще
                </Button>
              )}
              {isExpanded && needsTruncation && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 mt-2 text-blue-600 hover:text-blue-800"
                  onClick={() => setIsExpanded(false)}
                >
                  <Icon name="ChevronUp" size={14} className="mr-1" />
                  Скрыть
                </Button>
              )}
            </div>
          ) : (
            <div 
              className="text-sm text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={() => {
                setViewLanguage('ru');
                setEditingField({ productId, field });
              }}
            >
              {placeholder}
            </div>
          )}
        </div>
        
        {viewLanguage === 'ru' && (
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 flex-shrink-0"
            onClick={() => setEditingField({ productId, field })}
          >
            <Icon name="Edit2" size={12} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MultiLanguageTextField;