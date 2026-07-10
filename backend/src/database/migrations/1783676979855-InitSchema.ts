import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1783676979855 implements MigrationInterface {
    name = 'InitSchema1783676979855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" character varying(50) NOT NULL, "name" character varying(255) NOT NULL, "description" text NOT NULL, "price_from" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_status" AS ENUM('new', 'reviewing', 'payment_link_sent', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL, "product_id" character varying(50) NOT NULL, "customer_name" character varying(255) NOT NULL, "customer_email" character varying(255) NOT NULL, "quantity" integer NOT NULL, "notes" text, "file_names" text array NOT NULL DEFAULT '{}', "file_paths" text array NOT NULL DEFAULT '{}', "status" "public"."order_status" NOT NULL DEFAULT 'new', "payment_link" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_775c9f06fc27ae3ff8fb26f2c4" ON "orders" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_c884e321f927d5b86aac7c8f9e" ON "orders" ("created_at") `);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_ac832121b6c331b084ecc4121fd" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_ac832121b6c331b084ecc4121fd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c884e321f927d5b86aac7c8f9e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_775c9f06fc27ae3ff8fb26f2c4"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."order_status"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
