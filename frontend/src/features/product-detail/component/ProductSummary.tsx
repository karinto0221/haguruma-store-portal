import type { ProductSummaryProps } from '../type';

export default function ProductSummary({ product }: ProductSummaryProps) {
  return (
    <>
      <div className="detail-image-wrap">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="detail-image" />
        ) : (
          <div className="catalog-image-placeholder detail-placeholder">PAPER</div>
        )}
      </div>
      <div className="detail-category">{product.productCategoryName}</div>
      <h1 className="detail-title">{product.name}</h1>
      <div className="detail-price">
        ¥{product.priceFrom.toLocaleString()}〜 <small>（税込・参考価格）</small>
      </div>
      <p className="detail-description">{product.description}</p>
    </>
  );
}
