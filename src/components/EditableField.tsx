import React from 'react';
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
}

const EditableField: React.FC<EditableFieldProps> = ({ 
  productId, 
  field, 
  value, 
  type = 'text',
  editingField,
  setEditingField,
  onFieldEdit
}) => {
  const isEditing = editingField?.productId === productId && editingField?.field === field;

  if (isEditing) {
    return (
      <Input
        type={type}
        defaultValue={value}
        className="h-8 text-sm"
        autoFocus
        onBlur={(e) => onFieldEdit(productId, field, e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onFieldEdit(productId, field, e.currentTarget.value);
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
      <span className="text-sm">{value}</span>
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

export default EditableField;