import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductFormDialogProps } from '../type';

export default function ProductFormDialog({
  open,
  onOpenChange,
  categories,
  initialValue,
  onSubmit,
}: ProductFormDialogProps) {
  const isEdit = !!initialValue;
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceFrom, setPriceFrom] = useState(0);
  const [productCategoryId, setProductCategoryId] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setId(initialValue?.id || '');
      setName(initialValue?.name || '');
      setDescription(initialValue?.description || '');
      setPriceFrom(initialValue?.priceFrom ?? 0);
      setProductCategoryId(initialValue?.productCategoryId ?? categories[0]?.id ?? '');
      setError('');
    }
  }, [open, initialValue, categories]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (productCategoryId === '') return;
    setSubmitting(true);
    setError('');
    try {
      if (isEdit) {
        await onSubmit({ name, description, priceFrom, productCategoryId });
      } else {
        await onSubmit({ id, name, description, priceFrom, productCategoryId });
      }
      onOpenChange(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? '商品を編集' : '商品を新規作成'}</DialogTitle>
          </DialogHeader>

          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <Label htmlFor="productId">ID(URL用、半角英小文字・数字・ハイフン)</Label>
              <Input
                id="productId"
                value={id}
                onChange={(e) => setId(e.target.value)}
                disabled={isEdit}
                placeholder="business-card"
                required
              />
            </div>

            <div className="field" style={{ marginBottom: 0 }}>
              <Label htmlFor="productName">商品名</Label>
              <Input
                id="productName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="field" style={{ marginBottom: 0 }}>
              <Label htmlFor="productDescription">説明</Label>
              <Textarea
                id="productDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="field" style={{ marginBottom: 0 }}>
              <Label htmlFor="productPrice">参考価格(円)</Label>
              <Input
                id="productPrice"
                type="number"
                min={0}
                value={priceFrom}
                onChange={(e) => setPriceFrom(Number(e.target.value))}
                required
              />
            </div>

            <div className="field" style={{ marginBottom: 0 }}>
              <Label htmlFor="productCategory">カテゴリ</Label>
              <Select
                value={productCategoryId === '' ? undefined : String(productCategoryId)}
                onValueChange={(v) => setProductCategoryId(Number(v))}
              >
                <SelectTrigger id="productCategory" className="w-full">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="error-box" style={{ marginTop: 16 }}>
              {error}
            </div>
          )}

          <DialogFooter style={{ marginTop: 16 }}>
            <DialogClose asChild>
              <Button type="button" variant="link">
                キャンセル
              </Button>
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
