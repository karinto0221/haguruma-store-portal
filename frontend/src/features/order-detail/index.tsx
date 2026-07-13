import { useNavigate, useParams } from 'react-router-dom';
import OrderAttachmentsSection from './component/OrderAttachmentsSection';
import OrderDetailHeader from './component/OrderDetailHeader';
import OrderDetailMessages from './component/OrderDetailMessages';
import OrderInfoSection from './component/OrderInfoSection';
import OrderNotesSection from './component/OrderNotesSection';
import PaymentLinkSection from './component/PaymentLinkSection';
import { useOrderDetail } from './hook/useOrderDetail';

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const {
    order,
    attachments,
    paymentLink,
    setPaymentLink,
    loading,
    savingStatus,
    sending,
    error,
    success,
    updateStatus,
    sendPaymentLink,
  } = useOrderDetail(orderId);

  return (
    <div className="page page-wide order-detail-page-admin">
      <OrderDetailHeader
        order={order}
        savingStatus={savingStatus}
        onBack={() => navigate('/admin')}
        onStatusChange={updateStatus}
      />
      <OrderDetailMessages loading={loading} error={error} success={success} />

      {order && (
        <div className="order-detail-sections">
          <OrderInfoSection order={order} />
          <OrderNotesSection notes={order.notes} />
          <OrderAttachmentsSection attachments={attachments} />
          <PaymentLinkSection
            orderStatus={order.status}
            paymentLink={paymentLink}
            sending={sending}
            onPaymentLinkChange={setPaymentLink}
            onSend={sendPaymentLink}
          />
        </div>
      )}
    </div>
  );
}
