import { Button } from '@/components/ui/button';
import MasterTableViewport from '@/components/master/MasterTableViewport';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductTableProps } from '../type';

const COLUMN_COUNT = 5;

export default function ProductTable({ products, loading, onEdit, onDelete }: ProductTableProps) {
  return (
    <MasterTableViewport>
      <Table className="master-table product-master-table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-40">ID</TableHead>
            <TableHead>商品名</TableHead>
            <TableHead className="w-40">カテゴリ</TableHead>
            <TableHead className="w-32">参考価格</TableHead>
            <TableHead className="w-32 text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={COLUMN_COUNT}
                style={{ textAlign: 'center', color: 'var(--color-muted)' }}
              >
                読み込み中...
              </TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={COLUMN_COUNT}
                style={{ textAlign: 'center', color: 'var(--color-muted)' }}
              >
                該当する商品がありません。
              </TableCell>
            </TableRow>
          ) : (
            products.map((p) => (
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
            ))
          )}
        </TableBody>
      </Table>
    </MasterTableViewport>
  );
}
