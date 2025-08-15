import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface EditableFieldProps {
  productId: string;
  field: string;
  value: string | number;
  type?: string;
  editingField: {productId: string, field: string} | null;
  setEditingField: (field: {productId: string, field: string} | null) => void;
  onFieldEdit: (productId: string, field: string, value: string | number) => void;
  disabled?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({ 
  productId, 
  field, 
  value, 
  type = 'text',
  editingField,
  setEditingField,
  onFieldEdit,
  disabled = false
}) => {
  const isEditing = editingField?.productId === productId && editingField?.field === field;

  // Function to detect URLs and make them clickable
  const renderValue = (text: string | number) => {
    const textValue = String(text);
    
    // Check if this is a links field (contains URLs)
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const hasUrls = urlRegex.test(textValue);
    
    if (!hasUrls) {
      return <span className="text-sm">{textValue}</span>;
    }

    // Split text by lines and process each line
    const lines = textValue.split('\n');
    
    return (
      <div className="text-sm space-y-1">
        {lines.map((line, lineIndex) => {
          const parts = line.split(urlRegex);
          
          return (
            <div key={lineIndex} className="flex flex-wrap items-center gap-1">
              {parts.map((part, partIndex) => {
                if (urlRegex.test(part)) {
                  return (
                    <a
                      key={partIndex}
                      href={part}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors inline-flex items-center gap-1"
                    >
                      {part}
                      <Icon name="ExternalLink" size={12} className="flex-shrink-0" />
                    </a>
                  );
                } else if (part.trim()) {
                  return <span key={partIndex}>{part}</span>;
                }
                return null;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  if (isEditing) {
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const handleSave = () => {
      if (inputRef.current) {
        onFieldEdit(productId, field, inputRef.current.value);
        setEditingField(null);
      }
    };

    const handleCancel = () => {
      setEditingField(null);
    };

    return (
      <div className="space-y-2">
        {type === 'number' ? (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="number"
            defaultValue={value}
            className="w-full text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
              if (e.key === 'Escape') {
                handleCancel();
              }
            }}
          />
        ) : field === 'webLink' || field === 'description' ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            defaultValue={value}
            className="w-full min-h-[80px] p-2 text-sm border border-gray-300 rounded-md resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
            placeholder="Введите ссылки, каждую с новой строки..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleSave();
              }
              if (e.key === 'Escape') {
                handleCancel();
              }
            }}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            defaultValue={value}
            className="w-full text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
              if (e.key === 'Escape') {
                handleCancel();
              }
            }}
          />
        )}
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 bg-green-50 border-green-200 hover:bg-green-100"
            onClick={handleSave}
          >
            <Icon name="Check" size={14} className="text-green-600" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 bg-red-50 border-red-200 hover:bg-red-100"
            onClick={handleCancel}
          >
            <Icon name="X" size={14} className="text-red-600" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between group gap-2">
      <div className="flex-1 min-w-0">
        {renderValue(value)}
      </div>
      {!disabled && (
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
  );
};

export default EditableField;