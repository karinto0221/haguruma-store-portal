import { useEffect, useState } from 'react';
import { fetchProductCategories, ProductCategory } from '@/api';
import type { CategoryGridColumns } from '../type';

export function useProductSelect() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [columns, setColumns] = useState<CategoryGridColumns>(2);

  useEffect(() => {
    fetchProductCategories()
      .then(setCategories)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return {
    categories,
    loading,
    error,
    columns,
    setColumns,
  };
}
