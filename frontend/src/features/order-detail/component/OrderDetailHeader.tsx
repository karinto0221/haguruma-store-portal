import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_OPTIONS,
  type OrderStatus,
} from '@/api';
import { Label } from '@/components/ui/label';
import type { OrderDetailHeaderProps } from '../type';

const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  new: 'badge-new',
  reviewing: 'badge-reviewing',
  payment_link_sent: 'badge-sent',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
};

export default function OrderDetailHeader({
  order,
  savingStatus,
  onBack,
  onStatusChange,
}: OrderDetailHeaderProps) {
  return (
    <>
      <button type="button" className="back-link" onClick={onBack}>
        ← 注文一覧へ戻る
      </button>
      <div className="order-detail-heading">
        <div className="header">
          <span className="kicker">ORDER DETAIL</span>
          <h1>注文詳細</h1>
        </div>
        {order && (
          <div className="order-status-field">
            <Label htmlFor="orderStatus">注文ステータス</Label>
            <select
              id="orderStatus"
              className={`badge badge-select ${STATUS_BADGE_CLASS[order.status]}`}
              value={order.status}
              disabled={savingStatus}
              onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
            >
              {ORDER_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {ORDER_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </>
  );
}
