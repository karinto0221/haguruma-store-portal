const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface Product {
  id: string;
  name: string;
  description: string;
  priceFrom: number;
  productCategoryId: number;
  productCategoryName: string;
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

export interface AdminCredentials {
  id: string;
  password: string;
}

function adminHeaders(credentials: AdminCredentials): Record<string, string> {
  return {
    'x-admin-id': credentials.id,
    'x-admin-password': credentials.password,
  };
}

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  const body = await res.json().catch(() => ({}));
  if (Array.isArray(body.message)) return body.message.join(' / ');
  return body.message || fallback;
}

export async function loginAdmin(credentials: AdminCredentials): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: adminHeaders(credentials),
  });
  if (!res.ok) {
    throw new Error('ユーザーIDまたはパスワードが正しくありません');
  }
}

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

export interface OrdersSearchFilter {
  status?: OrderStatus | '';
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
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
    throw new Error(await parseErrorMessage(res, 'ステータスの更新に失敗しました'));
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
    throw new Error(await parseErrorMessage(res, '送信に失敗しました'));
  }
  return res.json();
}

// --- マスタ管理: 商品カテゴリ ---

export interface ProductCategory {
  id: number;
  name: string;
}

export interface ProductCategoryInput {
  name: string;
}

export async function fetchProductCategoriesAdmin(
  credentials: AdminCredentials,
): Promise<ProductCategory[]> {
  const res = await fetch(`${API_BASE_URL}/product-categories`, {
    headers: adminHeaders(credentials),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, '商品カテゴリ一覧の取得に失敗しました'));
  return res.json();
}

export async function createProductCategoryAdmin(
  credentials: AdminCredentials,
  input: ProductCategoryInput,
): Promise<ProductCategory> {
  const res = await fetch(`${API_BASE_URL}/product-categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders(credentials) },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, '商品カテゴリの作成に失敗しました'));
  return res.json();
}

export async function updateProductCategoryAdmin(
  credentials: AdminCredentials,
  id: number,
  input: ProductCategoryInput,
): Promise<ProductCategory> {
  const res = await fetch(`${API_BASE_URL}/product-categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...adminHeaders(credentials) },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, '商品カテゴリの更新に失敗しました'));
  return res.json();
}

export async function deleteProductCategoryAdmin(
  credentials: AdminCredentials,
  id: number,
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/product-categories/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(credentials),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, '商品カテゴリの削除に失敗しました'));
}

// --- マスタ管理: 商品 ---

export interface CreateProductInput {
  id: string;
  name: string;
  description: string;
  priceFrom: number;
  productCategoryId: number;
}

export interface UpdateProductInput {
  name: string;
  description: string;
  priceFrom: number;
  productCategoryId: number;
}

export async function fetchProductsAdmin(credentials: AdminCredentials): Promise<Product[]> {
  // 商品一覧は公開APIと共通(カテゴリ名は非公開情報ではないため)。認証ヘッダーは無視される
  const res = await fetch(`${API_BASE_URL}/products`, {
    headers: adminHeaders(credentials),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, '商品一覧の取得に失敗しました'));
  return res.json();
}

export async function createProductAdmin(
  credentials: AdminCredentials,
  input: CreateProductInput,
): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders(credentials) },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, '商品の作成に失敗しました'));
  return res.json();
}

export async function updateProductAdmin(
  credentials: AdminCredentials,
  id: string,
  input: UpdateProductInput,
): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...adminHeaders(credentials) },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, '商品の更新に失敗しました'));
  return res.json();
}

export async function deleteProductAdmin(credentials: AdminCredentials, id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(credentials),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, '商品の削除に失敗しました'));
}
