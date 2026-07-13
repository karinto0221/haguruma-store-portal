import type { OrderDetailMessagesProps } from '../type';

export default function OrderDetailMessages({
  loading,
  error,
  success,
}: OrderDetailMessagesProps) {
  return (
    <>
      {loading && <p>読み込み中...</p>}
      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}
    </>
  );
}
