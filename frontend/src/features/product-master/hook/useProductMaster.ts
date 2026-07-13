import { useEffect, useState } from 'react';
import {
  fetchProductsAdmin,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  fetchProductCategoriesAdmin,
  Product,
  ProductCategory,
  CreateProductInput,
  UpdateProductInput,
} from '@/api';
import { useAdminAuth } from '@/features/admin-auth';

export function useProductMaster() {
  const { credentials } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    if (!credentials) return;
    setLoading(true);
    setError('');
    try {
      const [productList, categoryList] = await Promise.all([
        fetchProductsAdmin(credentials),
        fetchProductCategoriesAdmin(credentials),
      ]);
      setProducts(productList);
      setCategories(categoryList);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials]);

  const create = async (input: CreateProductInput) => {
    if (!credentials) return;
    await createProductAdmin(credentials, input);
    await load();
  };

  const update = async (id: string, input: UpdateProductInput) => {
    if (!credentials) return;
    await updateProductAdmin(credentials, id, input);
    await load();
  };

  const remove = async (id: string) => {
    if (!credentials) return;
    await deleteProductAdmin(credentials, id);
    await load();
  };

  return { products, categories, loading, error, create, update, remove };
}
