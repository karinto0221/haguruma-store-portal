import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductTableProps } from '../type';

export default function ProductTable({ products, loading, onEdit, onDelete }: ProductTableProps) {
  if (loading) {
    return <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>読み込み中...</p>;
  }
  if (products.length === 0) {
    return <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>商品がまだありません。</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>商品名</TableHead>
          <TableHead>カテゴリ</TableHead>
          <TableHead>参考価格</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.id}</TableCell>
            <TableCell>{p.name}</TableCell>
            <TableCell>{p.productCategoryName}</TableCell>
            <TableCell>¥{p.priceFrom.toLocaleString()}〜</TableCell>
            <TableCell className="text-right">
              <Button variant="link" size="sm" onClick={() => onEdit(p)}>
                編集
              </Button>
              <Button variant="link" size="sm" onClick={() => onDelete(p)}>
                削除
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
