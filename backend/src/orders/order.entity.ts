import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from '../products/product.entity';
import { ORDER_STATUSES, OrderStatus } from './order-status';

@Entity('orders')
export class OrderEntity {
  // アプリ側でuuidv4()を発行してから採番するため、DB側では生成しない
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ name: 'product_id', type: 'varchar', length: 50 })
  productId: string;

  // 商品名は products テーブルから都度JOINして取得する(冗長に持たない)
  @ManyToOne(() => ProductEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column({ name: 'customer_name', type: 'varchar', length: 255 })
  customerName: string;

  @Column({ name: 'customer_email', type: 'varchar', length: 255 })
  customerEmail: string;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'file_names', type: 'text', array: true, default: '{}' })
  fileNames: string[];

  @Column({ name: 'file_paths', type: 'text', array: true, default: '{}' })
  filePaths: string[];

  @Index()
  @Column({
    type: 'enum',
    enum: ORDER_STATUSES,
    enumName: 'order_status',
    default: 'new',
  })
  status: OrderStatus;

  @Column({ name: 'payment_link', type: 'text', nullable: true })
  paymentLink: string | null;

  @Index()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
