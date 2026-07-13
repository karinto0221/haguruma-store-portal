import { MigrationInterface, QueryRunner } from 'typeorm';

// 商品カテゴリマスタ(product_categories)を新設し、products.product_category_id で参照させる。
// 既存商品にはカテゴリを割り当ててからNOT NULL制約を付与する(既存データがある状態で
// 直接NOT NULLカラムを追加すると失敗するため、追加→バックフィル→NOT NULL化の順で行う)。
const CATEGORY_NAMES = [
  '封筒・袋',
  'パッケージ・箱・フォルダー',
  '名刺',
  'カード・ペーパー',
  '冊子・ブックレット・ZINE',
  'ポケットフォルダー',
  'ペーパータグ・下げ札',
  'シール・ステッカー・商品ラベル',
  'ラッピングペーパー・薄葉紙',
];

// 既存商品(product.data.ts)をどのカテゴリに割り当てるか
const PRODUCT_CATEGORY_MAP: Record<string, string> = {
  'business-card': '名刺',
  envelope: '封筒・袋',
  postcard: 'カード・ペーパー',
  'wrapping-paper': 'ラッピングペーパー・薄葉紙',
  'package-box': 'パッケージ・箱・フォルダー',
};

export class AddProductCategories1783908720243 implements MigrationInterface {
  name = 'AddProductCategories1783908720243';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "product_categories" (
        "id" SERIAL NOT NULL,
        "name" character varying(255) NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_product_categories_id" PRIMARY KEY ("id")
      )
    `);

    const categoryIds: Record<string, number> = {};
    for (const name of CATEGORY_NAMES) {
      const result = await queryRunner.query(
        `INSERT INTO "product_categories" ("name") VALUES ($1) RETURNING "id"`,
        [name],
      );
      categoryIds[name] = result[0].id;
    }

    await queryRunner.query(
      `ALTER TABLE "products" ADD COLUMN "product_category_id" integer`,
    );

    for (const [productId, categoryName] of Object.entries(PRODUCT_CATEGORY_MAP)) {
      await queryRunner.query(
        `UPDATE "products" SET "product_category_id" = $1 WHERE "id" = $2`,
        [categoryIds[categoryName], productId],
      );
    }

    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "product_category_id" SET NOT NULL`,
    );
    await queryRunner.query(`
      ALTER TABLE "products"
      ADD CONSTRAINT "FK_products_product_category_id"
      FOREIGN KEY ("product_category_id") REFERENCES "product_categories"("id")
      ON DELETE RESTRICT ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_products_product_category_id"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "product_category_id"`);
    await queryRunner.query(`DROP TABLE "product_categories"`);
  }
}
