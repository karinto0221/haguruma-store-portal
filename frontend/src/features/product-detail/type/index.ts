import type { Product } from '@/api';

export interface ProductDetailHeaderProps {
  categoryName: string;
  onBack: () => void;
}

export interface ProductSummaryProps {
  product: Product;
}

export interface ProductOrderControlsProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onOrder: () => void;
}
