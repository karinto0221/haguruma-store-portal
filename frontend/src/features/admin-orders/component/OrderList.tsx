import { OrderListProps } from '../type';
import OrderRow from './OrderRow';

export default function OrderList({
  orders,
  loading,
  linkInputs,
  onLinkChange,
  onSend,
  onStatusChange,
}: OrderListProps) {
  return (
    <>
      <div style={{ marginTop: 20, fontSize: 13, color: 'var(--color-muted)' }}>
        {orders.length}件の注文
      </div>

      <div style={{ marginTop: 12 }}>
        {orders.map((o) => (
          <OrderRow
            key={o.id}
            order={o}
            linkValue={linkInputs[o.id] || ''}
            onLinkChange={(value) => onLinkChange(o.id, value)}
            onSend={() => onSend(o.id)}
            onStatusChange={(status) => onStatusChange(o.id, status)}
          />
        ))}
        {orders.length === 0 && !loading && (
          <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
            条件に一致する注文がありません。
          </div>
        )}
      </div>
    </>
  );
}
