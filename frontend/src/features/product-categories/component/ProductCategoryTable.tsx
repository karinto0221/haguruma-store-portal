import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductCategoryTableProps } from '../type';

export default function ProductCategoryTable({
  categories,
  loading,
  onEdit,
  onDelete,
}: ProductCategoryTableProps) {
  if (loading) {
    return <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>読み込み中...</p>;
  }
  if (categories.length === 0) {
    return <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>カテゴリがまだありません。</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>カテゴリ名</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.id}</TableCell>
            <TableCell>{c.name}</TableCell>
            <TableCell className="text-right">
              <Button variant="link" size="sm" onClick={() => onEdit(c)}>
                編集
              </Button>
              <Button variant="link" size="sm" onClick={() => onDelete(c)}>
                削除
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
