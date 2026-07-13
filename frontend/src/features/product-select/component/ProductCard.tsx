import { ProductCardProps } from '../type';

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <button className="product-card" onClick={() => onSelect(product.id)}>
      <div>
        <div className="name">{product.name}</div>
        <div className="desc">{product.description}</div>
      </div>
      <div className="price">¥{product.priceFrom.toLocaleString()}〜</div>
    </button>
  );
}
