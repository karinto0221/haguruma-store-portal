import { MigrationInterface, QueryRunner } from 'typeorm';
import { PRODUCTS } from '../../products/product.data';

// これまで product.data.ts に静的に持っていた商品ラインナップの初期データをDBに投入する。
// 将来的に管理画面から商品の追加・編集ができるようにするための土台。
export class SeedProducts1783676979856 implements MigrationInterface {
  name = 'SeedProducts1783676979856';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const product of PRODUCTS) {
      await queryRunner.query(
        `INSERT INTO "products" ("id", "name", "description", "price_from") VALUES ($1, $2, $3, $4)`,
        [product.id, product.name, product.description, product.priceFrom],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const product of PRODUCTS) {
      await queryRunner.query(`DELETE FROM "products" WHERE "id" = $1`, [product.id]);
    }
  }
}
