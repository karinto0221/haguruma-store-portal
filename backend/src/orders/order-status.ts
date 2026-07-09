// 注文ステータスの一覧と日本語ラベル。フロントエンドにも同じラベルを用意している。
export const ORDER_STATUSES = ['new', 'reviewing', 'payment_link_sent', 'cancelled'] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: '新規注文',
  reviewing: '内容確認中',
  payment_link_sent: 'メール送信済み',
  cancelled: 'キャンセル',
};
