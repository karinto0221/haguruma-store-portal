import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductSearchProps } from '../type';

// 一覧は少数件のためサーバーには問い合わせず、取得済みの一覧をその場でフィルタする
export default function ProductSearch({ filter, onFilterChange, categories }: ProductSearchProps) {
  return (
    <div className="filter-bar">
      <div className="filter-field">
        <Label htmlFor="productName">商品名で検索</Label>
        <Input
          id="productName"
          type="text"
          placeholder="商品名"
          value={filter.name}
          onChange={(e) => onFilterChange({ ...filter, name: e.target.value })}
        />
      </div>
      <div className="filter-field">
        <Label htmlFor="productCategoryFilter">カテゴリで検索</Label>
        <Select
          value={filter.categoryId === '' ? 'all' : String(filter.categoryId)}
          onValueChange={(v) =>
            onFilterChange({ ...filter, categoryId: v === 'all' ? '' : Number(v) })
          }
        >
          <SelectTrigger id="productCategoryFilter" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
