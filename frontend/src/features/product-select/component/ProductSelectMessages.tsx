import type { ProductSelectMessagesProps } from '../type';

export default function ProductSelectMessages({ loading, error }: ProductSelectMessagesProps) {
  return (
    <>
      {error && <div className="error-box">{error}</div>}
      {loading && <p>読み込み中...</p>}
    </>
  );
}
