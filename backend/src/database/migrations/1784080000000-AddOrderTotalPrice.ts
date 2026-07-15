import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderTotalPrice1784080000000 implements MigrationInterface {
  name = 'AddOrderTotalPrice1784080000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 既存注文を補完できるよう、最初はNULL許容で追加する。
    await queryRunner.query(`ALTER TABLE "orders" ADD COLUMN "total_price" integer`);
    await queryRunner.query(`
      UPDATE "orders" AS "order"
      SET "total_price" = "product"."price_from" * "order"."quantity"
      FROM "products" AS "product"
      WHERE "product"."id" = "order"."product_id"
    `);
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "total_price" SET NOT NULL`,
    );
    await queryRunner.query(`
      ALTER TABLE "orders"
      ADD CONSTRAINT "CHK_orders_total_price_non_negative"
      CHECK ("total_price" >= 0)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "CHK_orders_total_price_non_negative"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total_price"`);
  }
}
