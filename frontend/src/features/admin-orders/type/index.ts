import { OrderRecord, OrderStatus, OrdersSearchFilter } from '@/api';

export interface OrderSearchFilterProps {
  filter: OrdersSearchFilter;
  loading: boolean;
  onFilterChange: (filter: OrdersSearchFilter) => void;
  onSearch: () => void;
  onReset: () => void;
}

export interface OrderRowProps {
  order: OrderRecord;
  linkValue: string;
  onLinkChange: (value: string) => void;
  onSend: () => void;
  onStatusChange: (status: OrderStatus) => void;
}

export interface OrderListProps {
  orders: OrderRecord[];
  loading: boolean;
  linkInputs: Record<string, string>;
  onLinkChange: (orderId: string, value: string) => void;
  onSend: (orderId: string) => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}
