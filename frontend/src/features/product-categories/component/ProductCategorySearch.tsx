import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProductCategorySearchProps } from '../type';

// 一覧は少数件のためサーバーには問い合わせず、取得済みの一覧をその場でフィルタする
export default function ProductCategorySearch({
  keyword,
  onKeywordChange,
}: ProductCategorySearchProps) {
  return (
    <div className="filter-bar">
      <div className="filter-field">
        <Label htmlFor="categoryKeyword">カテゴリ名で検索</Label>
        <Input
          id="categoryKeyword"
          type="text"
          placeholder="カテゴリ名"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
        />
      </div>
    </div>
  );
}
