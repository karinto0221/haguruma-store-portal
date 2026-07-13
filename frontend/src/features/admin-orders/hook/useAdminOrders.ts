import { useEffect, useState } from 'react';
import {
  fetchOrdersAdmin,
  OrderRecord,
  OrdersSearchFilter,
} from '@/api';
import { useAdminAuth } from '@/features/admin-auth';

const EMPTY_FILTER: OrdersSearchFilter = {
  status: '',
  keyword: '',
  dateFrom: '',
  dateTo: '',
  includeCompleted: false,
};

export function useAdminOrders() {
  const { credentials, logout } = useAdminAuth();
  const [filter, setFilter] = useState<OrdersSearchFilter>(EMPTY_FILTER);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  return {
    filter,
    setFilter,
    orders,
    error,
    loading,
    handleSearch,
    handleResetFilter,
  };
}
