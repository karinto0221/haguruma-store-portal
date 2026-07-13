import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { CreateProductInput, Product, UpdateProductInput } from '@/api';
import { useProductMaster } from './hook/useProductMaster';
import ProductTable from './component/ProductTable';
import ProductFormDialog from './component/ProductFormDialog';

export default function ProductMaster() {
  const { products, categories, loading, error, create, update, remove } = useProductMaster();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setFormOpen(true);
  };

  const handleSubmit = async (input: CreateProductInput | UpdateProductInput) => {
    if (editing) {
      await update(editing.id, input as UpdateProductInput);
    } else {
      await create(input as CreateProductInput);
    }
  };

  const openDelete = (product: Product) => {
    setDeleting(product);
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
    <div className="page page-wide">
      <div className="header">
        <span className="kicker">MASTER</span>
        <h1>商品マスタ</h1>
        <Button
          style={{ marginLeft: 'auto', width: 'auto' }}
          onClick={openCreate}
          disabled={categories.length === 0}
        >
          新規作成
        </Button>
      </div>
      <p className="subtitle">商品の一覧・登録・編集・削除ができます。</p>
      {categories.length === 0 && !loading && (
        <div className="error-box">
          先に商品カテゴリを1件以上作成してください。
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      <ProductTable products={products} loading={loading} onEdit={openEdit} onDelete={openDelete} />

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        categories={categories}
        initialValue={editing}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>「{deleting?.name}」を削除しますか?</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。この商品を参照している注文が残っている場合は削除できません。
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
    </div>
  );
}
