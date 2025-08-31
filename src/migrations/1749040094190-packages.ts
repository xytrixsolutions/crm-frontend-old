import { MigrationInterface, QueryRunner } from 'typeorm';

export class Packages1749040094190 implements MigrationInterface {
  name = 'Packages1749040094190';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "packages" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "name" character varying NOT NULL, "lead_limit" integer NOT NULL, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, CONSTRAINT "UQ_4b511952e9d60aac9aa42e653f0" UNIQUE ("name"), CONSTRAINT "PK_020801f620e21f943ead9311c98" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "packages"`);
  }
}
