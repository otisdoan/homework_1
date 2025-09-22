export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
}
