import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { OrderCsvExportButtonProps } from '../type';
import { downloadOrdersCsv } from '../util/orderCsv';

export default function OrderCsvExportButton({
  orders,
  loading,
}: OrderCsvExportButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={loading || orders.length === 0}
      onClick={() => downloadOrdersCsv(orders)}
    >
      <Download aria-hidden="true" />
      CSV出力
    </Button>
  );
}
