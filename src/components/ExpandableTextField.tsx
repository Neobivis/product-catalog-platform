import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface ExpandableTextFieldProps {
  productId: string;
  field: string;
  value: string;
  placeholder?: string;
  editingField: {productId: string, field: string} | null;
  setEditingField: (field: {productId: string, field: string} | null) => void;
  onFieldEdit: (productId: string, field: string, value: string | number) => void;
}

const ExpandableTextField: React.FC<ExpandableTextFieldProps> = ({
  productId,
  field,
  value,
  placeholder = 'Добавить описание...',
  editingField,
  setEditingField,
  onFieldEdit
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isEditing = editingField?.productId === productId && editingField?.field === field;

  // Function to truncate text to approximately 4 sentences
  const truncateText = (text: string): { truncated: string; needsTruncation: boolean } => {
    if (!text) return { truncated: '', needsTruncation: false };
    
    // Split by sentence endings, keeping the punctuation
    const sentences = text.split(/([.!?]+\s*)/).filter(Boolean);
    
    // Take first 8 parts (4 sentences with their punctuation)
    const truncatedParts = sentences.slice(0, 8);
    const truncated = truncatedParts.join('');
    
    const needsTruncation = sentences.length > 8;
    
    return { truncated, needsTruncation };
  };

  const { truncated, needsTruncation } = truncateText(value);
  const displayText = isExpanded ? value : truncated;

  if (isEditing) {
    return (
      <div className="w-full">
        <Textarea
          defaultValue={value}
          placeholder={placeholder}
          className="min-h-[120px] text-sm resize-none"
          autoFocus
          onBlur={(e) => onFieldEdit(productId, field, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setEditingField(null);
            }
            // Allow Ctrl+Enter to save
            if (e.key === 'Enter' && e.ctrlKey) {
              onFieldEdit(productId, field, e.currentTarget.value);
            }
          }}
        />
        <div className="text-xs text-gray-500 mt-1">
          Ctrl+Enter для сохранения, Escape для отмены
        </div>
      </div>
    );
  }

  return (
    <div className="w-full group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {value ? (
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
              onClick={() => setEditingField({ productId, field })}
            >
              {placeholder}
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 flex-shrink-0"
          onClick={() => setEditingField({ productId, field })}
        >
          <Icon name="Edit2" size={12} />
        </Button>
      </div>
    </div>
  );
};

export default ExpandableTextField;