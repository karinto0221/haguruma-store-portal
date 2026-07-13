import ProductCard from './ProductCard';
import type { ProductGridProps } from '../type';

export default function ProductGrid({ products, columns, onSelect }: ProductGridProps) {
  return (
    <div className={`catalog-grid product-grid product-grid-${columns}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onSelect={onSelect} />
      ))}
    </div>
  );
}
