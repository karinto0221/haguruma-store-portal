import { useNavigate } from 'react-router-dom';
import CategoryGrid from './component/CategoryGrid';
import CategoryGridToolbar from './component/CategoryGridToolbar';
import ProductSelectHeader from './component/ProductSelectHeader';
import ProductSelectMessages from './component/ProductSelectMessages';
import { useProductSelect } from './hook/useProductSelect';

export default function ProductSelect() {
  const navigate = useNavigate();
  const { categories, loading, error, columns, setColumns } = useProductSelect();

  return (
    <div className="page product-select-page">
      <ProductSelectHeader />
      <ProductSelectMessages loading={loading} error={error} />
      <CategoryGridToolbar columns={columns} onColumnsChange={setColumns} />
      <CategoryGrid
        categories={categories}
        columns={columns}
        onSelect={(categoryId) => navigate(`/categories/${categoryId}/products`)}
      />
    </div>
  );
}
