import { ORDER_STATUS_LABELS, type OrderRecord } from '@/api';

const CSV_HEADERS = [
  '注文ID',
  '注文者',
  'メールアドレス',
  '電話番号',
  '商品',
  '個数',
  '値段',
  'ステータス',
  '注文日時',
  'ご要望',
  '添付ファイル',
];

function protectSpreadsheetFormula(value: string): string {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function escapeCsvCell(value: string | number | undefined): string {
  const normalized = protectSpreadsheetFormula(String(value ?? ''));
  return `"${normalized.replace(/"/g, '""')}"`;
}

function formatOrderDate(value: string): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZone: 'Asia/Tokyo',
  }).format(new Date(value));
}

function createFileName(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZone: 'Asia/Tokyo',
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return `orders_${value('year')}${value('month')}${value('day')}_${value('hour')}${value('minute')}${value('second')}.csv`;
}

export function buildOrdersCsv(orders: OrderRecord[]): string {
  const rows = orders.map((order) => [
    order.id,
    order.customerName,
    order.customerEmail,
    order.customerPhone,
    order.productName,
    order.quantity,
    order.totalPrice,
    ORDER_STATUS_LABELS[order.status],
    formatOrderDate(order.createdAt),
    order.notes,
    order.fileNames.length > 0 ? 'あり' : 'なし',
  ]);

  return `\uFEFF${[CSV_HEADERS, ...rows]
    .map((row) => row.map((cell) => escapeCsvCell(cell)).join(','))
    .join('\r\n')}`;
}

export function downloadOrdersCsv(orders: OrderRecord[]): void {
  const blob = new Blob([buildOrdersCsv(orders)], {
    type: 'text/csv;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = createFileName();
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
