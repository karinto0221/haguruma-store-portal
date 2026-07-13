import { FormEvent, useEffect, useState } from 'react';
import MasterFormDialogLayout from '@/components/master/MasterFormDialogLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProductCategoryFormDialogProps } from '../type';

export default function ProductCategoryFormDialog({
  open,
  onOpenChange,
  initialValue,
  onSubmit,
}: ProductCategoryFormDialogProps) {
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName(initialValue?.name || '');
      setImage(undefined);
      setError('');
    }
  }, [open, initialValue]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await onSubmit({ name, image });
      onOpenChange(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MasterFormDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={initialValue ? 'カテゴリを編集' : 'カテゴリを新規作成'}
      submitting={submitting}
      error={error}
      onSubmit={handleSubmit}
    >
      <div className="field" style={{ marginBottom: 0 }}>
        <Label htmlFor="categoryName">カテゴリ名</Label>
        <Input
          id="categoryName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <Label htmlFor="categoryImage">カテゴリ画像（5MBまで）</Label>
        {initialValue?.imageUrl && !image && (
          <img
            className="admin-image-preview"
            src={initialValue.imageUrl}
            alt="現在のカテゴリ画像"
          />
        )}
        <Input
          id="categoryImage"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0])}
        />
        <span className="field-hint">未選択のまま保存すると現在の画像を維持します。</span>
      </div>
    </MasterFormDialogLayout>
  );
}
