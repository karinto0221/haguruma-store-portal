const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface Product {
  id: string;
  name: string;
  description: string;
  priceFrom: number;
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) throw new Error('商品一覧の取得に失敗しました');
  return res.json();
}

export interface CreateOrderInput {
  productId: string;
  customerName: string;
  customerEmail: string;
  quantity: number;
  notes?: string;
  files: File[];
}

export async function createOrder(input: CreateOrderInput): Promise<{ orderId: string }> {
  const form = new FormData();
  form.append('productId', input.productId);
  form.append('customerName', input.customerName);
  form.append('customerEmail', input.customerEmail);
  form.append('quantity', String(input.quantity));
  if (input.notes) form.append('notes', input.notes);
  input.files.forEach((file) => form.append('files', file));

  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || '注文の送信に失敗しました');
  }
  return res.json();
}

// --- 管理者向け ---

export type OrderStatus = 'new' | 'reviewing' | 'payment_link_sent' | 'cancelled';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: '新規注文',
  reviewing: '内容確認中',
  payment_link_sent: 'メール送信済み',
  cancelled: 'キャンセル',
};

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  'new',
  'reviewing',
  'payment_link_sent',
  'cancelled',
];

export interface OrderRecord {
  id: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  quantity: number;
  notes?: string;
  fileNames: string[];
  status: OrderStatus;
  paymentLink?: string;
  createdAt: string;
}

export interface AdminCredentials {
  id: string;
  password: string;
}

export interface OrdersSearchFilter {
  status?: OrderStatus | '';
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
}

function adminHeaders(credentials: AdminCredentials): Record<string, string> {
  return {
    'x-admin-id': credentials.id,
    'x-admin-password': credentials.password,
  };
}

export async function fetchOrdersAdmin(
  credentials: AdminCredentials,
  filter: OrdersSearchFilter = {},
): Promise<OrderRecord[]> {
  const params = new URLSearchParams();
  if (filter.status) params.set('status', filter.status);
  if (filter.keyword) params.set('keyword', filter.keyword);
  if (filter.dateFrom) params.set('dateFrom', filter.dateFrom);
  if (filter.dateTo) params.set('dateTo', filter.dateTo);

  const query = params.toString();
  const res = await fetch(`${API_BASE_URL}/orders${query ? `?${query}` : ''}`, {
    headers: adminHeaders(credentials),
  });
  if (!res.ok) throw new Error('注文一覧の取得に失敗しました(ユーザーID・パスワードを確認してください)');
  return res.json();
}

export async function updateOrderStatusAdmin(
  credentials: AdminCredentials,
  orderId: string,
  status: OrderStatus,
): Promise<OrderRecord> {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...adminHeaders(credentials) },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'ステータスの更新に失敗しました');
  }
  return res.json();
}

export async function sendPaymentLinkAdmin(
  credentials: AdminCredentials,
  orderId: string,
  paymentLink: string,
): Promise<OrderRecord> {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/send-payment-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders(credentials) },
    body: JSON.stringify({ paymentLink }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || '送信に失敗しました');
  }
  return res.json();
}
