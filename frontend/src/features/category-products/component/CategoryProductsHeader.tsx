import type { CategoryProductsHeaderProps } from '../type';

export default function CategoryProductsHeader({ categoryName, onBack }: CategoryProductsHeaderProps) {
  return (
    <>
      <button className="back-link" onClick={onBack}>← カテゴリ一覧へ</button>
      <div className="header">
        <span className="stamp">2</span>
        <h1>{categoryName || '商品を選ぶ'}</h1>
      </div>
      <p className="subtitle">ご希望の商品を選んで、仕様と数量をご確認ください。</p>
    </>
  );
}
