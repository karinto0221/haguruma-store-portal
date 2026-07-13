import { Product } from '@/api';

export interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
}
