import { OrderStatus, ORDER_STATUS_LABELS, ORDER_STATUS_OPTIONS } from '@/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OrderRowProps } from '../type';

// ステータスは「色付きバッジに見えるドロップダウン」という特殊な見た目のため、
// shadcnのSelect(標準的な四角いフォームコントロールの見た目)は使わずネイティブ<select>のまま実装する。
const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  new: 'badge-new',
  reviewing: 'badge-reviewing',
  payment_link_sent: 'badge-sent',
  cancelled: 'badge-cancelled',
};

export default function OrderRow({
  order,
  linkValue,
  onLinkChange,
  onSend,
  onStatusChange,
}: OrderRowProps) {
  return (
    <div className="order-row">
      <div className="top-line">
        <span className="name">
          {order.productName} / {order.customerName}様
        </span>
        <select
          className={`badge badge-select ${STATUS_BADGE_CLASS[order.status]}`}
          value={order.status}
          onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
        >
          {ORDER_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
      <div className="meta">
        {order.customerEmail} ・ 数量 {order.quantity} ・{' '}
        {new Date(order.createdAt).toLocaleString('ja-JP')}
        <br />
        注文ID: {order.id}
        {order.notes && (
          <>
            <br />
            備考: {order.notes}
          </>
        )}
        {order.fileNames.length > 0 && (
          <>
            <br />
            添付: {order.fileNames.join(', ')}
          </>
        )}
      </div>
      {order.status === 'payment_link_sent' ? (
        <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
          送信済みリンク: {order.paymentLink}
        </div>
      ) : (
        <div className="link-form">
          <Input
            type="url"
            placeholder="支払いリンクを入力(https://...)"
            value={linkValue}
            onChange={(e) => onLinkChange(e.target.value)}
          />
          <Button type="button" onClick={onSend}>
            送信
          </Button>
        </div>
      )}
    </div>
  );
}
