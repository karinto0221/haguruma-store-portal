import type { OrderNotesSectionProps } from '../type';

export default function OrderNotesSection({ notes }: OrderNotesSectionProps) {
  return (
    <section className="order-detail-section">
      <h2>備考・ご要望</h2>
      <div className="order-notes-box">{notes || '備考はありません。'}</div>
    </section>
  );
}
