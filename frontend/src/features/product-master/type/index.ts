import { Product, ProductCategory, CreateProductInput, UpdateProductInput } from '@/api';

export interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: ProductCategory[];
  initialValue?: Product | null;
  onSubmit: (input: CreateProductInput | UpdateProductInput) => Promise<void>;
}
