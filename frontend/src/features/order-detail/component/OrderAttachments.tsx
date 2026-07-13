import type { OrderAttachmentsProps } from '../type';

export default function OrderAttachments({ attachments }: OrderAttachmentsProps) {
  if (attachments.length === 0) {
    return <p className="order-detail-empty">添付ファイルはありません。</p>;
  }

  return (
    <div className="order-attachment-grid">
      {attachments.map((attachment) => (
        <article className="order-attachment-card" key={`${attachment.index}-${attachment.name}`}>
          <div className="order-attachment-preview">
            {attachment.error && <div className="attachment-error">{attachment.error}</div>}
            {!attachment.error && attachment.kind === 'image' && attachment.url && (
              <img src={attachment.url} alt={`添付画像: ${attachment.name}`} />
            )}
            {!attachment.error && attachment.kind === 'pdf' && attachment.url && (
              <iframe src={attachment.url} title={`添付PDF: ${attachment.name}`} />
            )}
            {!attachment.error && attachment.kind === 'other' && (
              <div className="attachment-file-mark">FILE</div>
            )}
          </div>
          <div className="order-attachment-meta">
            <span>{attachment.name}</span>
            {attachment.url && (
              <a href={attachment.url} target="_blank" rel="noreferrer">
                ファイルを開く
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
