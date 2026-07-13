import { useAdminOrders } from './hook/useAdminOrders';
import OrderSearchFilter from './component/OrderSearchFilter';
import OrderList from './component/OrderList';

export default function AdminOrders() {
  const {
    filter,
    setFilter,
    orders,
    error,
    loading,
    linkInputs,
    handleSearch,
    handleResetFilter,
    handleStatusChange,
    handleSend,
    handleLinkChange,
  } = useAdminOrders();

  return (
    <div className="page page-wide">
      <div className="header">
        <span className="kicker">ADMIN</span>
        <h1>注文管理</h1>
      </div>
      <p className="subtitle">注文一覧の確認・検索と、支払いリンクの送信ができます。</p>

      <OrderSearchFilter
        filter={filter}
        loading={loading}
        onFilterChange={setFilter}
        onSearch={handleSearch}
        onReset={handleResetFilter}
      />

      {error && <div className="error-box" style={{ marginTop: 20 }}>{error}</div>}

      <OrderList
        orders={orders}
        loading={loading}
        linkInputs={linkInputs}
        onLinkChange={handleLinkChange}
        onSend={handleSend}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
