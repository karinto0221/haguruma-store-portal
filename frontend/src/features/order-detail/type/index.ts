import type { OrderRecord, OrderStatus } from '@/api';

export type AttachmentKind = 'image' | 'pdf' | 'other';

export interface OrderAttachment {
  index: number;
  name: string;
  kind: AttachmentKind;
  url?: string;
  error?: string;
}

export interface OrderDetailState {
  order: OrderRecord | null;
  attachments: OrderAttachment[];
}

export interface OrderDetailHeaderProps {
  order: OrderRecord | null;
  savingStatus: boolean;
  onBack: () => void;
  onStatusChange: (status: OrderStatus) => void;
}

export interface OrderDetailMessagesProps {
  loading: boolean;
  error: string;
  success: string;
}

export interface OrderInfoSectionProps {
  order: OrderRecord;
}

export interface OrderNotesSectionProps {
  notes?: string;
}

export interface OrderAttachmentsProps {
  attachments: OrderAttachment[];
}

export type OrderAttachmentsSectionProps = OrderAttachmentsProps;

export interface PaymentLinkSectionProps {
  orderStatus: OrderStatus;
  paymentLink: string;
  sending: boolean;
  onPaymentLinkChange: (paymentLink: string) => void;
  onSend: () => void;
}
