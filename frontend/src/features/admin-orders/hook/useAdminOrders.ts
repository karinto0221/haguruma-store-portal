import { useEffect, useState } from 'react';
import {
  fetchOrdersAdmin,
  sendPaymentLinkAdmin,
  updateOrderStatusAdmin,
  OrderRecord,
  OrderStatus,
  OrdersSearchFilter,
} from '@/api';
import { useAdminAuth } from '@/features/admin-auth';

const EMPTY_FILTER: OrdersSearchFilter = {
  status: '',
  keyword: '',
  dateFrom: '',
  dateTo: '',
};

export function useAdminOrders() {
  const { credentials, logout } = useAdminAuth();
  const [filter, setFilter] = useState<OrdersSearchFilter>(EMPTY_FILTER);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkInputs, setLinkInputs] = useState<Record<string, string>>({});

  const load = async (appliedFilter: OrdersSearchFilter) => {
    if (!credentials) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchOrdersAdmin(credentials, appliedFilter);
      setOrders(data);
    } catch (e: any) {
      setError(e.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials]);

  const handleSearch = async () => {
    await load(filter);
  };

  const handleResetFilter = async () => {
    setFilter(EMPTY_FILTER);
    await load(EMPTY_FILTER);
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    if (!credentials) return;
    try {
      await updateOrderStatusAdmin(credentials, orderId, status);
      await load(filter);
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
      await load(filter);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleLinkChange = (orderId: string, value: string) => {
    setLinkInputs((prev) => ({ ...prev, [orderId]: value }));
  };

  return {
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
  };
}
