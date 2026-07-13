import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCompletedOrderStatus1783911000000 implements MigrationInterface {
  name = 'AddCompletedOrderStatus1783911000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "order_status" ADD VALUE IF NOT EXISTS 'completed'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "status" TYPE character varying USING "status"::text`,
    );
    await queryRunner.query(
      `UPDATE "orders" SET "status" = 'reviewing' WHERE "status" = 'completed'`,
    );
    await queryRunner.query(`DROP TYPE "order_status"`);
    await queryRunner.query(
      `CREATE TYPE "order_status" AS ENUM ('new', 'reviewing', 'payment_link_sent', 'cancelled')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "status" TYPE "order_status" USING "status"::"order_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'new'`,
    );
  }
}
