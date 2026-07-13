import CategoryCard from './CategoryCard';
import type { CategoryGridProps } from '../type';

export default function CategoryGrid({ categories, columns, onSelect }: CategoryGridProps) {
  return (
    <div className={`catalog-grid category-grid category-grid-${columns}`}>
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} onSelect={onSelect} />
      ))}
    </div>
  );
}
