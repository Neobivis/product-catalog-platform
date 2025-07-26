import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Category } from '@/types/product';

interface CategoryManagerProps {
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
  translations: any;
}

interface EditingCategory {
  id: string;
  name: string;
  icon?: string;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onUpdateCategories,
  translations: t
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);
  const [newCategoryParent, setNewCategoryParent] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const startEdit = (category: Category) => {
    setEditingCategory({
      id: category.id,
      name: category.name,
      icon: category.icon
    });
  };

  const cancelEdit = () => {
    setEditingCategory(null);
  };

  const saveEdit = () => {
    if (!editingCategory) return;

    const updateCategoryInTree = (cats: Category[]): Category[] => {
      return cats.map(cat => {
        if (cat.id === editingCategory.id) {
          return {
            ...cat,
            name: editingCategory.name,
            icon: editingCategory.icon
          };
        }
        if (cat.children) {
          return {
            ...cat,
            children: updateCategoryInTree(cat.children)
          };
        }
        return cat;
      });
    };

    onUpdateCategories(updateCategoryInTree(categories));
    setEditingCategory(null);
  };

  const deleteCategory = (categoryId: string) => {
    if (window.confirm(t.confirmDeleteCategory || 'Вы уверены, что хотите удалить эту категорию?')) {
      const deleteCategoryFromTree = (cats: Category[]): Category[] => {
        return cats
          .filter(cat => cat.id !== categoryId)
          .map(cat => ({
            ...cat,
            children: cat.children ? deleteCategoryFromTree(cat.children) : undefined
          }));
      };

      onUpdateCategories(deleteCategoryFromTree(categories));
    }
  };

  const addNewCategory = (parentId: string | null) => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      name: newCategoryName.trim(),
      icon: newCategoryIcon.trim() || undefined
    };

    if (parentId === null) {
      // Add as root category
      onUpdateCategories([...categories, newCategory]);
    } else {
      // Add as child category
      const addToParent = (cats: Category[]): Category[] => {
        return cats.map(cat => {
          if (cat.id === parentId) {
            return {
              ...cat,
              children: [...(cat.children || []), newCategory]
            };
          }
          if (cat.children) {
            return {
              ...cat,
              children: addToParent(cat.children)
            };
          }
          return cat;
        });
      };

      onUpdateCategories(addToParent(categories));
    }

    setNewCategoryName('');
    setNewCategoryIcon('');
    setNewCategoryParent(null);
  };

  const renderCategoryTree = (cats: Category[], level = 0) => {
    return cats.map(category => (
      <div key={category.id} className="border border-gray-200 rounded-lg mb-2 bg-white">
        <div className={`flex items-center justify-between p-3 ${level > 0 ? 'ml-4' : ''}`}>
          <div className="flex items-center gap-3 flex-1">
            {/* Expand/Collapse button */}
            {category.children && category.children.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0"
                onClick={() => toggleExpanded(category.id)}
              >
                <Icon 
                  name={expandedCategories.has(category.id) ? "ChevronDown" : "ChevronRight"} 
                  size={14} 
                />
              </Button>
            )}
            
            {/* Category info */}
            <div className="flex items-center gap-2 flex-1">
              {category.icon && (
                <Icon name={category.icon} size={18} className="text-gray-600" />
              )}
              
              {editingCategory?.id === category.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({
                      ...editingCategory,
                      name: e.target.value
                    })}
                    className="h-8 text-sm"
                    placeholder="Название категории"
                  />
                  <Input
                    value={editingCategory.icon || ''}
                    onChange={(e) => setEditingCategory({
                      ...editingCategory,
                      icon: e.target.value
                    })}
                    className="h-8 text-sm w-32"
                    placeholder="Иконка"
                  />
                  <Button size="sm" onClick={saveEdit} className="h-8">
                    <Icon name="Check" size={14} />
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit} className="h-8">
                    <Icon name="X" size={14} />
                  </Button>
                </div>
              ) : (
                <span className="font-medium text-gray-800">{category.name}</span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          {editingCategory?.id !== category.id && (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setNewCategoryParent(category.id)}
                className="h-8 w-8 p-0"
                title="Добавить подкategорию"
              >
                <Icon name="Plus" size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => startEdit(category)}
                className="h-8 w-8 p-0"
                title="Редактировать"
              >
                <Icon name="Edit" size={14} />
              </Button>
              {category.id !== 'uncategorized' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteCategory(category.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  title="Удалить"
                >
                  <Icon name="Trash2" size={14} />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Add new subcategory form */}
        {newCategoryParent === category.id && (
          <div className="px-3 pb-3 border-t bg-gray-50">
            <div className="flex items-center gap-2 mt-3">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Название новой подкатегории"
                className="h-8 text-sm flex-1"
              />
              <Input
                value={newCategoryIcon}
                onChange={(e) => setNewCategoryIcon(e.target.value)}
                placeholder="Иконка"
                className="h-8 text-sm w-32"
              />
              <Button 
                size="sm" 
                onClick={() => addNewCategory(category.id)}
                className="h-8"
                disabled={!newCategoryName.trim()}
              >
                <Icon name="Plus" size={14} />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setNewCategoryParent(null)}
                className="h-8"
              >
                <Icon name="X" size={14} />
              </Button>
            </div>
          </div>
        )}

        {/* Subcategories */}
        {category.children && expandedCategories.has(category.id) && (
          <div className="ml-4 pb-2">
            {renderCategoryTree(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t.categoryManagement || 'Управление категориями'}</h3>
        <Button
          onClick={() => setNewCategoryParent(null)}
          disabled={newCategoryParent !== null}
        >
          <Icon name="Plus" size={16} className="mr-2" />
          {t.addRootCategory || 'Добавить корневую категорию'}
        </Button>
      </div>

      {/* Add new root category form */}
      {newCategoryParent === null && newCategoryParent !== undefined && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium mb-3">{t.addNewRootCategory || 'Добавить новую корневую категорию'}</h4>
          <div className="flex items-center gap-2">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Название категории"
              className="flex-1"
            />
            <Input
              value={newCategoryIcon}
              onChange={(e) => setNewCategoryIcon(e.target.value)}
              placeholder="Иконка (например: Package)"
              className="w-48"
            />
            <Button 
              onClick={() => addNewCategory(null)}
              disabled={!newCategoryName.trim()}
            >
              <Icon name="Plus" size={16} />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setNewCategoryParent(undefined)}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Categories tree */}
      <div className="space-y-2">
        {categories.length > 0 ? (
          renderCategoryTree(categories)
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Icon name="FolderOpen" size={48} className="mx-auto mb-4 text-gray-400" />
            <p>{t.noCategoriesYet || 'Категории еще не созданы'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;