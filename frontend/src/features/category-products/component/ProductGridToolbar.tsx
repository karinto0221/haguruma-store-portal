import type { ProductGridToolbarProps } from '../type';

export default function ProductGridToolbar({ columns, onColumnsChange }: ProductGridToolbarProps) {
  return (
    <div className="catalog-view-toolbar">
      <span>カード表示</span>
      <div className="catalog-view-switch" role="group" aria-label="カードの列数">
        <button
          type="button"
          aria-pressed={columns === 1}
          className={columns === 1 ? 'active' : ''}
          onClick={() => onColumnsChange(1)}
        >
          1列
        </button>
        <button
          type="button"
          aria-pressed={columns === 2}
          className={columns === 2 ? 'active' : ''}
          onClick={() => onColumnsChange(2)}
        >
          2列
        </button>
      </div>
    </div>
  );
}
