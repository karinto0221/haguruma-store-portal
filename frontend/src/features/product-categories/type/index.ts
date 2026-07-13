import { ProductCategory, ProductCategoryInput } from '@/api';

export interface ProductCategoryTableProps {
  categories: ProductCategory[];
  loading: boolean;
  onEdit: (category: ProductCategory) => void;
  onDelete: (category: ProductCategory) => void;
}

export interface ProductCategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue?: ProductCategory | null;
  onSubmit: (input: ProductCategoryInput) => Promise<void>;
}
