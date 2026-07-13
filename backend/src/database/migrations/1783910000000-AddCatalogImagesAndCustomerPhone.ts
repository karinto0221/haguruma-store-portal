import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCatalogImagesAndCustomerPhone1783910000000 implements MigrationInterface {
  name = 'AddCatalogImagesAndCustomerPhone1783910000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_categories" ADD COLUMN "image_data" bytea`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" ADD COLUMN "image_mime_type" character varying(100)`,
    );
    await queryRunner.query(`ALTER TABLE "products" ADD COLUMN "image_data" bytea`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD COLUMN "image_mime_type" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD COLUMN "customer_phone" character varying(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "customer_phone"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "image_mime_type"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "image_data"`);
    await queryRunner.query(
      `ALTER TABLE "product_categories" DROP COLUMN "image_mime_type"`,
    );
    await queryRunner.query(`ALTER TABLE "product_categories" DROP COLUMN "image_data"`);
  }
}
