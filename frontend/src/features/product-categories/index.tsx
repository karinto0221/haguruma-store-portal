import { useState } from 'react';
import MasterPageLayout from '@/components/master/MasterPageLayout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ProductCategory, ProductCategoryInput } from '@/api';
import { useProductCategories } from './hook/useProductCategories';
import ProductCategoryTable from './component/ProductCategoryTable';
import ProductCategoryFormDialog from './component/ProductCategoryFormDialog';
import ProductCategorySearch from './component/ProductCategorySearch';

export default function ProductCategories() {
  const { categories, loading, error, create, update, remove } = useProductCategories();
  const [keyword, setKeyword] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProductCategory | null>(null);
  const [deleting, setDeleting] = useState<ProductCategory | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(keyword.trim().toLowerCase()),
  );

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (category: ProductCategory) => {
    setEditing(category);
    setFormOpen(true);
  };

  const handleSubmit = async (input: ProductCategoryInput) => {
    if (editing) {
      await update(editing.id, input);
    } else {
      await create(input);
    }
  };

  const openDelete = (category: ProductCategory) => {
    setDeleting(category);
    setDeleteError('');
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteSubmitting(true);
    setDeleteError('');
    try {
      await remove(deleting.id);
      setDeleting(null);
    } catch (e: any) {
      setDeleteError(e.message);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <MasterPageLayout
      title="商品カテゴリ"
      description="商品カテゴリの一覧・登録・編集・削除ができます。"
      onCreate={openCreate}
    >
      <ProductCategorySearch keyword={keyword} onKeywordChange={setKeyword} />

      {error && <div className="error-box">{error}</div>}

      <ProductCategoryTable
        categories={filteredCategories}
        loading={loading}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <ProductCategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialValue={editing}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>「{deleting?.name}」を削除しますか?</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。このカテゴリに属する商品が残っている場合は削除できません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && <div className="error-box">{deleteError}</div>}
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteSubmitting}
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
            >
              {deleteSubmitting ? '削除中...' : '削除する'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MasterPageLayout>
  );
}
