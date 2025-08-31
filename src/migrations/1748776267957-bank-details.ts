import { MigrationInterface, QueryRunner } from 'typeorm';

export class BankDetails1748776267957 implements MigrationInterface {
  name = 'BankDetails1748776267957';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bank_details" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "name" character varying NOT NULL, "account_number" character varying NOT NULL, "sort_code" character varying NOT NULL, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, "business_profile_id" integer, CONSTRAINT "REL_b175649dc281f8f98fd0bcf4d8" UNIQUE ("business_profile_id"), CONSTRAINT "PK_ddbbcb9586b7f4d6124fe58f257" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_details" ADD CONSTRAINT "FK_b175649dc281f8f98fd0bcf4d81" FOREIGN KEY ("business_profile_id") REFERENCES "business_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bank_details" DROP CONSTRAINT "FK_b175649dc281f8f98fd0bcf4d81"`,
    );
    await queryRunner.query(`DROP TABLE "bank_details"`);
  }
}
