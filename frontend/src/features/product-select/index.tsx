import { useNavigate } from 'react-router-dom';
import { useProducts } from './hook/useProducts';
import ProductCard from './component/ProductCard';

export default function ProductSelect() {
  const { products, loading, error } = useProducts();
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="header">
        <span className="kicker">ORDER</span>
        <h1>ご注文商品の選択</h1>
      </div>
      <p className="subtitle">
        お作りしたい紙製品を選んでください。デザインのご入稿はこの後の画面で行えます。
      </p>

      {error && <div className="error-box">{error}</div>}
      {loading && <p>読み込み中...</p>}

      <div className="product-list">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onSelect={(id) => navigate(`/order/${id}`)} />
        ))}
      </div>
    </div>
  );
}
