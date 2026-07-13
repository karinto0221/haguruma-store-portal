import { OrderRecord, OrdersSearchFilter } from '@/api';

export interface OrderSearchFilterProps {
  filter: OrdersSearchFilter;
  loading: boolean;
  onFilterChange: (filter: OrdersSearchFilter) => void;
  onSearch: () => void;
  onReset: () => void;
}

export interface OrderRowProps {
  order: OrderRecord;
  onSelect: () => void;
}

export interface OrderListProps {
  orders: OrderRecord[];
  loading: boolean;
  onSelect: (orderId: string) => void;
}
