import OrderAttachments from './OrderAttachments';
import type { OrderAttachmentsSectionProps } from '../type';

export default function OrderAttachmentsSection({ attachments }: OrderAttachmentsSectionProps) {
  return (
    <section className="order-detail-section">
      <h2>添付ファイル</h2>
      <p className="section-description">注文時に送信された画像やPDFを確認できます。</p>
      <OrderAttachments attachments={attachments} />
    </section>
  );
}
