import { MigrationInterface, QueryRunner } from 'typeorm';

export class Vat1749291845854 implements MigrationInterface {
  name = 'Vat1749291845854';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "vats" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "vat_percent" numeric(10,2) NOT NULL, "user_id" character varying NOT NULL, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, CONSTRAINT "PK_2af241e093fefa4d4a47eceae85" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "vats"`);
  }
}
