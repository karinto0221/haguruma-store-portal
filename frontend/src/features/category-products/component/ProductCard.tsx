import type { ProductCardProps } from '../type';

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <button className="product-card" onClick={() => onSelect(product.id)}>
      <div className="catalog-image-wrap">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt="" className="catalog-image" />
        ) : (
          <div className="catalog-image-placeholder">PAPER</div>
        )}
      </div>
      <div className="product-card-body">
        <div className="name">{product.name}</div>
        <div className="desc">{product.description}</div>
        <div className="price">¥{product.priceFrom.toLocaleString()}〜</div>
      </div>
    </button>
  );
}
