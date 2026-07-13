import type { ProductDetailHeaderProps } from '../type';

export default function ProductDetailHeader({ categoryName, onBack }: ProductDetailHeaderProps) {
  return (
    <button className="back-link" onClick={onBack}>
      ← {categoryName}の商品一覧へ
    </button>
  );
}
