import { MigrationInterface, QueryRunner } from 'typeorm';

export class TermsAndConditions1748702061305 implements MigrationInterface {
  name = 'TermsAndConditions1748702061305';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "terms_and_conditions" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "sale_terms" text, "quotation_terms" text, "warranty_terms" text, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, "business_profile_id" integer, CONSTRAINT "REL_441e9069cbf2759cd8ab93453b" UNIQUE ("business_profile_id"), CONSTRAINT "PK_4ab651fa6e201399c954dbe263d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "terms_and_conditions" ADD CONSTRAINT "FK_441e9069cbf2759cd8ab93453b6" FOREIGN KEY ("business_profile_id") REFERENCES "business_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "terms_and_conditions" DROP CONSTRAINT "FK_441e9069cbf2759cd8ab93453b6"`,
    );
    await queryRunner.query(`DROP TABLE "terms_and_conditions"`);
  }
}
