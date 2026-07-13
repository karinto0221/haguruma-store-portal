import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useOrderForm } from './hook/useOrderForm';
import FileUploadField from './component/FileUploadField';

export default function OrderForm() {
  const { productId } = useParams();
  const {
    product,
    customerName,
    setCustomerName,
    customerEmail,
    setCustomerEmail,
    customerPhone,
    setCustomerPhone,
    quantity,
    setQuantity,
    notes,
    setNotes,
    files,
    setFiles,
    submitting,
    error,
    handleSubmit,
  } = useOrderForm(productId);

  return (
    <div className="page">
      {product && (
        <button className="back-link" onClick={() => window.history.back()} type="button">
          ← 商品詳細へ戻る
        </button>
      )}
      <div className="header">
        <span className="stamp">4</span>
        <h1>ご注文内容の入力</h1>
      </div>
      <p className="subtitle">
        {product ? `選択中の商品: ${product.name}` : '商品情報を読み込み中...'}
      </p>

      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <Label htmlFor="customerName">お名前</Label>
          <Input
            id="customerName"
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div className="field">
          <Label htmlFor="customerEmail">メールアドレス</Label>
          <Input
            id="customerEmail"
            type="email"
            required
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <Label htmlFor="customerPhone">電話番号（任意）</Label>
          <Input
            id="customerPhone"
            type="tel"
            autoComplete="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="090-1234-5678"
          />
        </div>

        <div className="field">
          <Label htmlFor="quantity">数量</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            required
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <div className="field">
          <Label htmlFor="notes">ご要望・備考(サイズ、色、納期など)</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <FileUploadField files={files} onFilesChange={setFiles} />

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? '送信中...' : 'この内容で注文する'}
        </Button>
      </form>
    </div>
  );
}
