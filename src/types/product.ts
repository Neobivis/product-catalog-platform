export interface Product {
  id: string;
  nameEn: string;
  nameCn: string;
  nameRu: string;
  price: number;
  sku: string;
  quantity: number;
  brand: string;
  webLink: string;
  category: string;
  images: string[];
  currentImageIndex: number;
  description?: string;
  descriptionEn?: string;
  descriptionCn?: string;
  tnved?: string;
  material?: string;
  purpose?: string;
  forWhom?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  children?: Category[];
}

export type Language = 'ru' | 'cn';