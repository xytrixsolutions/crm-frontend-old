import { MigrationInterface, QueryRunner } from 'typeorm';

export class Sales1749200798334 implements MigrationInterface {
  name = 'Sales1749200798334';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sales" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "invoice_number" character varying NOT NULL, "warranty" character varying NOT NULL, "engine_type" character varying NOT NULL, "milage" character varying, "sub_total" numeric(10,2) NOT NULL, "vat_percent" numeric(10,2) NOT NULL, "total" numeric(10,2) NOT NULL, "note" text, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, "lead_id" integer, "user_id" integer, CONSTRAINT "PK_4f0bc990ae81dba46da680895ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sale_items" ("id" SERIAL NOT NULL, "description" text, "quantity" integer NOT NULL, "price" numeric(10,2) NOT NULL, "total_price" numeric(10,2) NOT NULL, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, "sales_id" integer, CONSTRAINT "PK_5a7dc5b4562a9e590528b3e08ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" ADD CONSTRAINT "FK_4b5d9d17033166db032a47f82ba" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" ADD CONSTRAINT "FK_5f282f3656814ec9ca2675aef6f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale_items" ADD CONSTRAINT "FK_6c57074a6b265e890e2034c29e6" FOREIGN KEY ("sales_id") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sale_items" DROP CONSTRAINT "FK_6c57074a6b265e890e2034c29e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" DROP CONSTRAINT "FK_5f282f3656814ec9ca2675aef6f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" DROP CONSTRAINT "FK_4b5d9d17033166db032a47f82ba"`,
    );
    await queryRunner.query(`DROP TABLE "sale_items"`);
    await queryRunner.query(`DROP TABLE "sales"`);
  }
}
