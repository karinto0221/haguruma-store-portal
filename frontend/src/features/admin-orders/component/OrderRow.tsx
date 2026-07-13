import { OrderStatus, ORDER_STATUS_LABELS } from "@/api";
import { OrderRowProps } from "../type";

// 一覧では現在ステータスを色付きバッジとして表示し、変更操作は詳細画面へ集約する。
const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  new: "badge-new",
  reviewing: "badge-reviewing",
  payment_link_sent: "badge-sent",
  completed: "badge-completed",
  cancelled: "badge-cancelled",
};

export default function OrderRow({ order, onSelect }: OrderRowProps) {
  return (
    <button
      type="button"
      className="order-row order-summary-card"
      onClick={onSelect}
    >
      <div className="top-line">
        <span className="name">注文ID：{order.id}</span>
        <span className={`badge ${STATUS_BADGE_CLASS[order.status]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>
      <dl className="order-summary-grid">
        <div>
          <dt>商品名</dt>
          <dd>{order.productName}</dd>
        </div>
        <div>
          <dt>注文者</dt>
          <dd>{order.customerName}様</dd>
        </div>
        <div>
          <dt>数量</dt>
          <dd>{order.quantity}</dd>
        </div>
        <div>
          <dt>受付日時</dt>
          <dd>{new Date(order.createdAt).toLocaleString("ja-JP")}</dd>
        </div>
      </dl>
      <div className="order-summary-footer">
        <span>
          <strong>注文ID</strong> {order.id}
        </span>
        <span className="order-detail-link">詳細を見る →</span>
      </div>
    </button>
  );
}
