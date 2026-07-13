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
import { ProductCategoryTableProps } from '../type';

const COLUMN_COUNT = 3;

export default function ProductCategoryTable({
  categories,
  loading,
  onEdit,
  onDelete,
}: ProductCategoryTableProps) {
  return (
    <MasterTableViewport>
      <Table className="master-table product-category-table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">ID</TableHead>
            <TableHead>カテゴリ名</TableHead>
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
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={COLUMN_COUNT}
                style={{ textAlign: 'center', color: 'var(--color-muted)' }}
              >
                該当するカテゴリがありません。
              </TableCell>
            </TableRow>
          ) : (
            categories.map((c) => (
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
            ))
          )}
        </TableBody>
      </Table>
    </MasterTableViewport>
  );
}
