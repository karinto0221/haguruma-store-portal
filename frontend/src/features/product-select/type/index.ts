import type { ProductCategory } from '@/api';

export type CategoryGridColumns = 1 | 2;

export interface ProductSelectMessagesProps {
  loading: boolean;
  error: string;
}

export interface CategoryGridToolbarProps {
  columns: CategoryGridColumns;
  onColumnsChange: (columns: CategoryGridColumns) => void;
}

export interface CategoryCardProps {
  category: ProductCategory;
  onSelect: (categoryId: number) => void;
}

export interface CategoryGridProps {
  categories: ProductCategory[];
  columns: CategoryGridColumns;
  onSelect: (categoryId: number) => void;
}
