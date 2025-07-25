import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Language } from '@/types/product';
import { translateDescriptions } from '@/utils/translation';

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
  const [isTranslating, setIsTranslating] = useState(false);
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

  const handleSave = async (newRuText: string) => {
    setIsTranslating(true);
    
    try {
      // Save Russian text immediately
      onFieldEdit(productId, field, newRuText);
      
      // Auto-translate to other languages
      if (newRuText.trim()) {
        const translations = await translateDescriptions(newRuText);
        
        // Save English translation
        onFieldEdit(productId, `${field}En`, translations.en);
        
        // Save Chinese translation
        onFieldEdit(productId, `${field}Cn`, translations.cn);
      } else {
        // Clear translations if Russian text is empty
        onFieldEdit(productId, `${field}En`, '');
        onFieldEdit(productId, `${field}Cn`, '');
      }
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleManualTranslate = async () => {
    if (!valueRu.trim()) return;
    
    setIsTranslating(true);
    
    try {
      console.log('Translating text:', valueRu);
      const translations = await translateDescriptions(valueRu);
      console.log('Translation results:', translations);
      
      // Save English translation
      onFieldEdit(productId, `${field}En`, translations.en);
      
      // Save Chinese translation
      onFieldEdit(productId, `${field}Cn`, translations.cn);
      
      console.log('Translations saved');
    } catch (error) {
      console.error('Manual translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
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
          {isTranslating && (
            <div className="flex items-center gap-1 ml-2">
              <Icon name="Loader2" size={12} className="animate-spin" />
              <span className="text-xs text-gray-500">Переводим...</span>
            </div>
          )}
        </div>
        
        <Textarea
          defaultValue={valueRu}
          placeholder={placeholder}
          className="min-h-[120px] text-sm resize-none"
          autoFocus
          onBlur={(e) => handleSave(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setEditingField(null);
            }
            if (e.key === 'Enter' && e.ctrlKey) {
              handleSave(e.currentTarget.value);
            }
          }}
        />
        <div className="text-xs text-gray-500 mt-1">
          Ctrl+Enter для сохранения, Escape для отмены. Автоматический перевод на EN/CN после сохранения.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full group">
      <div className="flex items-center gap-2 mb-3">
        {availableLanguages.map((lang) => (
          <Button
            key={lang.code}
            variant={viewLanguage === lang.code ? 'default' : 'outline'}
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => setViewLanguage(lang.code)}
          >
            {lang.label}
          </Button>
        ))}
        
        {/* Manual translate button */}
        {valueRu && !isTranslating && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
            onClick={handleManualTranslate}
            disabled={!valueRu.trim()}
          >
            <Icon name="RotateCcw" size={12} className="mr-1" />
            Перевести
          </Button>
        )}
        
        {isTranslating && (
          <div className="flex items-center gap-1">
            <Icon name="Loader2" size={12} className="animate-spin" />
            <span className="text-xs text-gray-500">Переводим...</span>
          </div>
        )}
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