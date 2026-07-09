import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
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
 * 今はJSONファイル(data/orders.json)に保存しているが、
 * 本番でRDS(Postgres)やDynamoDBに移行する際は、このクラスのメソッドの
 * 中身だけ差し替えれば呼び出し側(OrdersService)には影響しない設計にしている。
 */
@Injectable()
export class OrdersRepository {
  private readonly filePath = path.join(process.cwd(), 'data', 'orders.json');

  private async readAll(): Promise<OrderRecord[]> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  private async writeAll(orders: OrderRecord[]) {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(orders, null, 2), 'utf-8');
  }

  async create(order: OrderRecord): Promise<OrderRecord> {
    const orders = await this.readAll();
    orders.push(order);
    await this.writeAll(orders);
    return order;
  }

  async findAll(filter: OrdersFilter = {}): Promise<OrderRecord[]> {
    let orders = await this.readAll();

    if (filter.status) {
      orders = orders.filter((o) => o.status === filter.status);
    }
    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.customerName.toLowerCase().includes(keyword) ||
          o.customerEmail.toLowerCase().includes(keyword) ||
          o.productName.toLowerCase().includes(keyword) ||
          o.id.toLowerCase().includes(keyword),
      );
    }
    if (filter.dateFrom) {
      orders = orders.filter((o) => o.createdAt >= filter.dateFrom!);
    }
    if (filter.dateTo) {
      orders = orders.filter((o) => o.createdAt <= filter.dateTo!);
    }

    return orders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  async findById(id: string): Promise<OrderRecord | undefined> {
    const orders = await this.readAll();
    return orders.find((o) => o.id === id);
  }

  async update(id: string, patch: Partial<OrderRecord>): Promise<OrderRecord | undefined> {
    const orders = await this.readAll();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) return undefined;
    orders[idx] = { ...orders[idx], ...patch };
    await this.writeAll(orders);
    return orders[idx];
  }
}
