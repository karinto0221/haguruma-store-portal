import { useEffect, useState } from 'react';
import {
  fetchProductCategoriesAdmin,
  createProductCategoryAdmin,
  updateProductCategoryAdmin,
  deleteProductCategoryAdmin,
  ProductCategory,
  ProductCategoryInput,
} from '@/api';
import { useAdminAuth } from '@/features/admin-auth';

export function useProductCategories() {
  const { credentials } = useAdminAuth();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    if (!credentials) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchProductCategoriesAdmin(credentials);
      setCategories(data);
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

  // create/update/removeはエラーを飲み込まずそのまま呼び出し元(フォーム側)に伝える。
  // フォーム側でダイアログを閉じずにエラーを表示するために必要。
  const create = async (input: ProductCategoryInput) => {
    if (!credentials) return;
    await createProductCategoryAdmin(credentials, input);
    await load();
  };

  const update = async (id: number, input: ProductCategoryInput) => {
    if (!credentials) return;
    await updateProductCategoryAdmin(credentials, id, input);
    await load();
  };

  const remove = async (id: number) => {
    if (!credentials) return;
    await deleteProductCategoryAdmin(credentials, id);
    await load();
  };

  return { categories, loading, error, create, update, remove };
}
