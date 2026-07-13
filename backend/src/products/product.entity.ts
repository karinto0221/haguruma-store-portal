import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductCategoryEntity } from './product-category.entity';

@Entity('products')
export class ProductEntity {
  // スラッグ形式のID(例: business-card)。注文フォームのURLや注文テーブルからの参照に使う
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  // 目安価格。実際は数量・仕様によって変動するため「参考価格」として表示
  @Column({ name: 'price_from', type: 'integer' })
  priceFrom: number;

  @Column({ name: 'product_category_id', type: 'integer' })
  productCategoryId: number;

  @ManyToOne(() => ProductCategoryEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_category_id' })
  productCategory: ProductCategoryEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
