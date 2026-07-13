import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PaymentLinkSectionProps } from '../type';

export default function PaymentLinkSection({
  orderStatus,
  paymentLink,
  sending,
  onPaymentLinkChange,
  onSend,
}: PaymentLinkSectionProps) {
  return (
    <section className="order-detail-section">
      <h2>支払いURL</h2>
      <p className="section-description">
        入力したURLをお客様のメールアドレスへ送信し、ステータスを「メール送信済み」に更新します。
      </p>
      <div className="payment-link-detail-form">
        <div className="field">
          <Label htmlFor="paymentLink">支払い用URL</Label>
          <Input
            id="paymentLink"
            type="url"
            placeholder="https://example.com/payment/..."
            value={paymentLink}
            onChange={(e) => onPaymentLinkChange(e.target.value)}
          />
        </div>
        <Button type="button" disabled={sending || !paymentLink.trim()} onClick={onSend}>
          {sending
            ? '送信中...'
            : orderStatus === 'payment_link_sent'
              ? '支払いURLを再送信'
              : '支払いURLを送信'}
        </Button>
      </div>
    </section>
  );
}
