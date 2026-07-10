import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../orders/order.entity';
import { OrderStatus } from '../orders/order-status';

export { OrderStatus };

export interface OrderRecord {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  quantity: number;
  notes?: string;
  fileNames: string[];
  filePaths: string[];
  status: OrderStatus;
  paymentLink?: string;
  createdAt: string;
}

export interface OrdersFilter {
  status?: OrderStatus;
  // 顧客名・メール・商品名・注文IDのいずれかに部分一致すれば該当とみなす
  keyword?: string;
  // createdAt (ISO文字列) の範囲。両端を含む
  dateFrom?: string;
  dateTo?: string;
}

/**
 * 注文データの保存先を抽象化する簡易リポジトリ。
 * PostgreSQL(TypeORM)に保存している。呼び出し側(OrdersService)はこのクラスの
 * メソッドのシグネチャにのみ依存しているため、保存先を差し替える際もここだけの変更で済む。
 */
@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,
  ) {}

  async create(order: OrderRecord): Promise<OrderRecord> {
    const entity = this.ordersRepository.create({
      id: order.id,
      productId: order.productId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      quantity: order.quantity,
      notes: order.notes ?? null,
      fileNames: order.fileNames,
      filePaths: order.filePaths,
      status: order.status,
      paymentLink: order.paymentLink ?? null,
    });
    await this.ordersRepository.save(entity);

    const saved = await this.ordersRepository.findOne({
      where: { id: entity.id },
      relations: ['product'],
    });
    return this.toRecord(saved!);
  }

  async findAll(filter: OrdersFilter = {}): Promise<OrderRecord[]> {
    const qb = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.product', 'product')
      .orderBy('order.createdAt', 'DESC');

    if (filter.status) {
      qb.andWhere('order.status = :status', { status: filter.status });
    }
    if (filter.keyword) {
      qb.andWhere(
        '(order.customerName ILIKE :keyword OR order.customerEmail ILIKE :keyword OR product.name ILIKE :keyword OR CAST(order.id AS text) ILIKE :keyword)',
        { keyword: `%${filter.keyword}%` },
      );
    }
    if (filter.dateFrom) {
      qb.andWhere('order.createdAt >= :dateFrom', { dateFrom: filter.dateFrom });
    }
    if (filter.dateTo) {
      qb.andWhere('order.createdAt <= :dateTo', { dateTo: filter.dateTo });
    }

    const entities = await qb.getMany();
    return entities.map((e) => this.toRecord(e));
  }

  async findById(id: string): Promise<OrderRecord | undefined> {
    const entity = await this.ordersRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    return entity ? this.toRecord(entity) : undefined;
  }

  async update(id: string, patch: Partial<OrderRecord>): Promise<OrderRecord | undefined> {
    const entity = await this.ordersRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!entity) return undefined;

    if (patch.status !== undefined) entity.status = patch.status;
    if (patch.paymentLink !== undefined) entity.paymentLink = patch.paymentLink;

    await this.ordersRepository.save(entity);
    return this.toRecord(entity);
  }

  private toRecord(entity: OrderEntity): OrderRecord {
    return {
      id: entity.id,
      productId: entity.productId,
      productName: entity.product?.name ?? '',
      customerName: entity.customerName,
      customerEmail: entity.customerEmail,
      quantity: entity.quantity,
      notes: entity.notes ?? undefined,
      fileNames: entity.fileNames,
      filePaths: entity.filePaths,
      status: entity.status,
      paymentLink: entity.paymentLink ?? undefined,
      createdAt: entity.createdAt.toISOString(),
    };
  }
}
