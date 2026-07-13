import { useAdminOrders } from "./hook/useAdminOrders";
import OrderSearchFilter from "./component/OrderSearchFilter";
import OrderList from "./component/OrderList";

export default function AdminOrders() {
  const navigate = useNavigate();
  const {
    filter,
    setFilter,
    orders,
    error,
    loading,
    handleSearch,
    handleResetFilter,
  } = useAdminOrders();

  return (
    <div className="page page-wide">
      <div className="header">
        <span className="kicker">ORDERS</span>
        <h1>注文管理</h1>
      </div>
      <p className="subtitle">
        注文内容を検索し、カードを選択すると詳細を確認できます。
      </p>

      <OrderSearchFilter
        filter={filter}
        loading={loading}
        onFilterChange={setFilter}
        onSearch={handleSearch}
        onReset={handleResetFilter}
      />

      {error && (
        <div className="error-box" style={{ marginTop: 20 }}>
          {error}
        </div>
      )}

      <OrderList
        orders={orders}
        loading={loading}
        onSelect={(orderId) => navigate(`/admin/orders/${orderId}`)}
      />
    </div>
  );
}
import { useNavigate } from "react-router-dom";
