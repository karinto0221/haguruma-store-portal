import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ProductOrderControlsProps } from '../type';

export default function ProductOrderControls({
  quantity,
  onQuantityChange,
  onOrder,
}: ProductOrderControlsProps) {
  return (
    <div className="detail-order-box">
      <div className="field detail-quantity">
        <Label htmlFor="detailQuantity">数量</Label>
        <Input
          id="detailQuantity"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => onQuantityChange(Math.max(1, Number(e.target.value) || 1))}
        />
      </div>
      <Button type="button" className="detail-order-button" onClick={onOrder}>
        注文情報の入力へ
      </Button>
    </div>
  );
}
