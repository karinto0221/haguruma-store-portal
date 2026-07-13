import { useNavigate, useParams } from 'react-router-dom';
import CategoryProductsHeader from './component/CategoryProductsHeader';
import ProductGrid from './component/ProductGrid';
import ProductGridToolbar from './component/ProductGridToolbar';
import { useCategoryProducts } from './hook/useCategoryProducts';

export default function CategoryProducts() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const {
    category,
    filteredProducts,
    loading,
    error,
    columns,
    setColumns,
  } = useCategoryProducts(categoryId);

  return (
    <div className="page page-catalog category-products-page">
      <CategoryProductsHeader
        categoryName={category?.name}
        onBack={() => navigate('/')}
      />
      {error && <div className="error-box">{error}</div>}
      {loading && <p>読み込み中...</p>}
      {!loading && filteredProducts.length === 0 && (
        <div className="empty-catalog">このカテゴリの商品はまだ登録されていません。</div>
      )}
      <ProductGridToolbar columns={columns} onColumnsChange={setColumns} />
      <ProductGrid
        products={filteredProducts}
        columns={columns}
        onSelect={(id) => navigate(`/products/${id}`)}
      />
    </div>
  );
}
