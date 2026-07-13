import { useLocation } from 'react-router-dom';

export function useOrderId(): string | undefined {
  const location = useLocation();
  return (location.state as { orderId?: string } | null)?.orderId;
}
