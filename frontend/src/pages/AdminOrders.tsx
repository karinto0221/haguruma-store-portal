import { FormEvent, useState } from 'react';
import {
  fetchOrdersAdmin,
  sendPaymentLinkAdmin,
  updateOrderStatusAdmin,
  AdminCredentials,
  OrderRecord,
  OrderStatus,
  OrdersSearchFilter,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_OPTIONS,
} from '../api';

const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  new: 'badge-new',
  reviewing: 'badge-reviewing',
  payment_link_sent: 'badge-sent',
  cancelled: 'badge-cancelled',
};

const EMPTY_FILTER: OrdersSearchFilter = {
  status: '',
  keyword: '',
  dateFrom: '',
  dateTo: '',
};

export default function AdminOrders() {
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [credentials, setCredentials] = useState<AdminCredentials | null>(null);

  const [filter, setFilter] = useState<OrdersSearchFilter>(EMPTY_FILTER);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkInputs, setLinkInputs] = useState<Record<string, string>>({});

  const load = async (creds: AdminCredentials, appliedFilter: OrdersSearchFilter) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchOrdersAdmin(creds, appliedFilter);
      setOrders(data);
    } catch (e: any) {
      setError(e.message);
      setCredentials(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const creds = { id: loginId, password: loginPassword };
    setCredentials(creds);
    await load(creds, filter);
  };

  const handleLogout = () => {
    setCredentials(null);
    setOrders([]);
    setLoginPassword('');
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!credentials) return;
    await load(credentials, filter);
  };

  const handleResetFilter = async () => {
    if (!credentials) return;
    setFilter(EMPTY_FILTER);
    await load(credentials, EMPTY_FILTER);
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    if (!credentials) return;
    try {
      await updateOrderStatusAdmin(credentials, orderId, status);
      await load(credentials, filter);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleSend = async (orderId: string) => {
    if (!credentials) return;
    const link = linkInputs[orderId];
    if (!link) return;
    try {
      await sendPaymentLinkAdmin(credentials, orderId, link);
      await load(credentials, filter);
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (!credentials) {
    return (
      <div className="page">
        <div className="header">
          <span className="kicker">ADMIN</span>
          <h1>管理者ログイン</h1>
        </div>
        <p className="subtitle">ユーザーIDとパスワードを入力してください。</p>

        <form onSubmit={handleLogin}>
          <div className="field">
            <label htmlFor="loginId">ユーザーID</label>
            <input
              id="loginId"
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label htmlFor="loginPassword">パスワード</label>
            <input
              id="loginPassword"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && <div className="error-box">{error}</div>}
          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading || !loginId || !loginPassword}
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="page page-wide">
      <div className="header">
        <span className="kicker">ADMIN</span>
        <h1>注文管理</h1>
        <button className="btn-link" style={{ marginLeft: 'auto' }} onClick={handleLogout}>
          ログアウト
        </button>
      </div>
      <p className="subtitle">注文一覧の確認・検索と、支払いリンクの送信ができます。</p>

      <form className="filter-bar" onSubmit={handleSearch}>
        <div className="filter-field">
          <label htmlFor="filterKeyword">キーワード</label>
          <input
            id="filterKeyword"
            type="text"
            placeholder="顧客名・メール・商品名・注文ID"
            value={filter.keyword}
            onChange={(e) => setFilter((prev) => ({ ...prev, keyword: e.target.value }))}
          />
        </div>
        <div className="filter-field">
          <label htmlFor="filterStatus">ステータス</label>
          <select
            id="filterStatus"
            value={filter.status}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, status: e.target.value as OrderStatus | '' }))
            }
          >
            <option value="">すべて</option>
            {ORDER_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {ORDER_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filterDateFrom">期間(開始)</label>
          <input
            id="filterDateFrom"
            type="date"
            value={filter.dateFrom}
            onChange={(e) => setFilter((prev) => ({ ...prev, dateFrom: e.target.value }))}
          />
        </div>
        <div className="filter-field">
          <label htmlFor="filterDateTo">期間(終了)</label>
          <input
            id="filterDateTo"
            type="date"
            value={filter.dateTo}
            onChange={(e) => setFilter((prev) => ({ ...prev, dateTo: e.target.value }))}
          />
        </div>
        <div className="filter-actions">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? '検索中...' : '検索'}
          </button>
          <button className="btn-link" type="button" onClick={handleResetFilter}>
            条件をリセット
          </button>
        </div>
      </form>

      {error && <div className="error-box" style={{ marginTop: 20 }}>{error}</div>}

      <div style={{ marginTop: 20, fontSize: 13, color: 'var(--color-muted)' }}>
        {orders.length}件の注文
      </div>

      <div style={{ marginTop: 12 }}>
        {orders.map((o) => (
          <div className="order-row" key={o.id}>
            <div className="top-line">
              <span className="name">
                {o.productName} / {o.customerName}様
              </span>
              <select
                className={`badge badge-select ${STATUS_BADGE_CLASS[o.status]}`}
                value={o.status}
                onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
              >
                {ORDER_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {ORDER_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div className="meta">
              {o.customerEmail} ・ 数量 {o.quantity} ・{' '}
              {new Date(o.createdAt).toLocaleString('ja-JP')}
              <br />
              注文ID: {o.id}
              {o.notes && (
                <>
                  <br />
                  備考: {o.notes}
                </>
              )}
              {o.fileNames.length > 0 && (
                <>
                  <br />
                  添付: {o.fileNames.join(', ')}
                </>
              )}
            </div>
            {o.status === 'payment_link_sent' ? (
              <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                送信済みリンク: {o.paymentLink}
              </div>
            ) : (
              <div className="link-form">
                <input
                  type="url"
                  placeholder="支払いリンクを入力(https://...)"
                  value={linkInputs[o.id] || ''}
                  onChange={(e) =>
                    setLinkInputs((prev) => ({ ...prev, [o.id]: e.target.value }))
                  }
                />
                <button onClick={() => handleSend(o.id)}>送信</button>
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && !loading && (
          <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
            条件に一致する注文がありません。
          </div>
        )}
      </div>
    </div>
  );
}
