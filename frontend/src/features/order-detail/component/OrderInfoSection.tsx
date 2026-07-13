import type { OrderInfoSectionProps } from '../type';

export default function OrderInfoSection({ order }: OrderInfoSectionProps) {
  return (
    <section className="order-detail-section">
      <h2>注文情報</h2>
      <dl className="order-detail-data-grid">
        <div><dt>注文ID</dt><dd>{order.id}</dd></div>
        <div><dt>受付日時</dt><dd>{new Date(order.createdAt).toLocaleString('ja-JP')}</dd></div>
        <div><dt>商品</dt><dd>{order.productName}</dd></div>
        <div><dt>数量</dt><dd>{order.quantity}</dd></div>
        <div><dt>注文者</dt><dd>{order.customerName}様</dd></div>
        <div><dt>メールアドレス</dt><dd>{order.customerEmail}</dd></div>
        <div><dt>電話番号</dt><dd>{order.customerPhone || '未入力'}</dd></div>
      </dl>
    </section>
  );
}
