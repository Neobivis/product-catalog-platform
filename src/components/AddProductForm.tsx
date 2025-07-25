import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Product } from '@/types/product';

interface AddProductFormProps {
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  newProduct: Partial<Product>;
  setNewProduct: (product: Partial<Product>) => void;
  allCategories: string[];
  translations: any;
  onAddProduct: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  showAddForm,
  setShowAddForm,
  newProduct,
  setNewProduct,
  allCategories,
  translations: t,
  onAddProduct
}) => {
  return (
    <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Icon name="Plus" size={16} />
          {t.addProduct}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.addNewProduct}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nameEn">{t.nameEn}</Label>
              <Input
                id="nameEn"
                value={newProduct.nameEn}
                onChange={(e) => setNewProduct(prev => ({...prev, nameEn: e.target.value}))}
                placeholder="Product name in English"
              />
            </div>
            <div>
              <Label htmlFor="nameCn">{t.nameCn}</Label>
              <Input
                id="nameCn"
                value={newProduct.nameCn}
                onChange={(e) => setNewProduct(prev => ({...prev, nameCn: e.target.value}))}
                placeholder="产品名称"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="nameRu">{t.nameRu}</Label>
            <Input
              id="nameRu"
              value={newProduct.nameRu}
              onChange={(e) => setNewProduct(prev => ({...prev, nameRu: e.target.value}))}
              placeholder="Название товара"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">{t.price}</Label>
              <Input
                id="price"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct(prev => ({...prev, price: Number(e.target.value)}))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="sku">{t.sku}</Label>
              <Input
                id="sku"
                value={newProduct.sku}
                onChange={(e) => setNewProduct(prev => ({...prev, sku: e.target.value}))}
                placeholder="PRODUCT-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">{t.quantity}</Label>
              <Input
                id="quantity"
                type="number"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct(prev => ({...prev, quantity: Number(e.target.value)}))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="brand">{t.brand}</Label>
              <Input
                id="brand"
                value={newProduct.brand}
                onChange={(e) => setNewProduct(prev => ({...prev, brand: e.target.value}))}
                placeholder="Brand Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">{t.category}</Label>
              <Select 
                value={newProduct.category} 
                onValueChange={(value) => setNewProduct(prev => ({...prev, category: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`${t.category}...`} />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="webLink">{t.webLink}</Label>
              <Input
                id="webLink"
                value={newProduct.webLink}
                onChange={(e) => setNewProduct(prev => ({...prev, webLink: e.target.value}))}
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Russian fields section */}
          <div className="border-t pt-4 mt-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-3">Российские сертификаты</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tnved">{t.tnved}</Label>
                <Input
                  id="tnved"
                  value={newProduct.tnved || ''}
                  onChange={(e) => setNewProduct(prev => ({...prev, tnved: e.target.value}))}
                  placeholder="8471300000"
                />
              </div>
              <div>
                <Label htmlFor="material">{t.material}</Label>
                <Input
                  id="material"
                  value={newProduct.material || ''}
                  onChange={(e) => setNewProduct(prev => ({...prev, material: e.target.value}))}
                  placeholder="Пластик, металл"
                />
              </div>
              <div>
                <Label htmlFor="purpose">{t.purpose}</Label>
                <Input
                  id="purpose"
                  value={newProduct.purpose || ''}
                  onChange={(e) => setNewProduct(prev => ({...prev, purpose: e.target.value}))}
                  placeholder="Предназначение товара"
                />
              </div>
              <div>
                <Label htmlFor="forWhom">{t.forWhom}</Label>
                <Input
                  id="forWhom"
                  value={newProduct.forWhom || ''}
                  onChange={(e) => setNewProduct(prev => ({...prev, forWhom: e.target.value}))}
                  placeholder="Взрослые"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              {t.cancel}
            </Button>
            <Button onClick={onAddProduct}>
              {t.add} {t.products.slice(0, -2)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductForm;