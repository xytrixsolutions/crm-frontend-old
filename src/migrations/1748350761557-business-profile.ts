import { MigrationInterface, QueryRunner } from 'typeorm';

export class BusinessProfile1748350761557 implements MigrationInterface {
  name = 'BusinessProfile1748350761557';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "business_profiles" ("id" SERIAL NOT NULL, "business_name" character varying NOT NULL, "primary_phone" character varying NOT NULL, "alternate_phone" character varying, "default_warranty" character varying, "vat_number" character varying, "business_type" character varying, "street_address" character varying NOT NULL, "city" character varying NOT NULL, "post_code" character varying NOT NULL, "country" character varying NOT NULL, "quoting_person_name" character varying NOT NULL, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, "user_id" integer, CONSTRAINT "UQ_8a17348949c1d65fa7039a25cd3" UNIQUE ("primary_phone"), CONSTRAINT "PK_29525485b1db8e87caf6a5ef042" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_11caf68aadb72bcdff98659815" ON "business_profiles" ("business_name") `,
    );
    await queryRunner.query(
      `ALTER TABLE "business_profiles" ADD CONSTRAINT "FK_1ceee77c549695cfc7c246224ef" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_profiles" DROP CONSTRAINT "FK_1ceee77c549695cfc7c246224ef"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_11caf68aadb72bcdff98659815"`,
    );
    await queryRunner.query(`DROP TABLE "business_profiles"`);
  }
}
