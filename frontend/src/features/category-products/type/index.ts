import type { Product } from '@/api';

export type ProductGridColumns = 1 | 2;

export interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
}

export interface CategoryProductsHeaderProps {
  categoryName?: string;
  onBack: () => void;
}

export interface ProductGridToolbarProps {
  columns: ProductGridColumns;
  onColumnsChange: (columns: ProductGridColumns) => void;
}

export interface ProductGridProps {
  products: Product[];
  columns: ProductGridColumns;
  onSelect: (productId: string) => void;
}
