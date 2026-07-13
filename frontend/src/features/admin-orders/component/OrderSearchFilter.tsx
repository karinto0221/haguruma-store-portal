import { FormEvent } from 'react';
import { OrderStatus, ORDER_STATUS_LABELS, ORDER_STATUS_OPTIONS } from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderSearchFilterProps } from '../type';

export default function OrderSearchFilter({
  filter,
  loading,
  onFilterChange,
  onSearch,
  onReset,
}: OrderSearchFilterProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form className="filter-bar" onSubmit={handleSubmit}>
      <div className="filter-field">
        <Label htmlFor="filterKeyword">キーワード</Label>
        <Input
          id="filterKeyword"
          type="text"
          placeholder="顧客名・メール・商品名・注文ID"
          value={filter.keyword}
          onChange={(e) => onFilterChange({ ...filter, keyword: e.target.value })}
        />
      </div>
      <div className="filter-field">
        <Label htmlFor="filterStatus">ステータス</Label>
        <Select
          value={filter.status || 'all'}
          onValueChange={(value) =>
            onFilterChange({ ...filter, status: value === 'all' ? '' : (value as OrderStatus) })
          }
        >
          <SelectTrigger id="filterStatus" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {ORDER_STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {ORDER_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="filter-field">
        <Label htmlFor="filterDateFrom">期間(開始)</Label>
        <Input
          id="filterDateFrom"
          type="date"
          value={filter.dateFrom}
          onChange={(e) => onFilterChange({ ...filter, dateFrom: e.target.value })}
        />
      </div>
      <div className="filter-field">
        <Label htmlFor="filterDateTo">期間(終了)</Label>
        <Input
          id="filterDateTo"
          type="date"
          value={filter.dateTo}
          onChange={(e) => onFilterChange({ ...filter, dateTo: e.target.value })}
        />
      </div>
      <div className="filter-actions">
        <Button type="submit" disabled={loading}>
          {loading ? '検索中...' : '検索'}
        </Button>
        <Button type="button" variant="link" onClick={onReset}>
          条件をリセット
        </Button>
      </div>
    </form>
  );
}
