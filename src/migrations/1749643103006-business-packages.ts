import { MigrationInterface, QueryRunner } from 'typeorm';

export class BusinessPackages1749643103006 implements MigrationInterface {
  name = 'BusinessPackages1749643103006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "business_packages" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "lead_used" integer NOT NULL, "expires_at" bigint, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, "package_id" integer, "business_id" integer, CONSTRAINT "PK_43c489bc667ee3095e11a33ee7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_packages" ADD CONSTRAINT "FK_f0e244abc6398809171eb323880" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_packages" ADD CONSTRAINT "FK_f24f9e2b468a34067c2edaea9c4" FOREIGN KEY ("business_id") REFERENCES "business_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_packages" DROP CONSTRAINT "FK_f24f9e2b468a34067c2edaea9c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_packages" DROP CONSTRAINT "FK_f0e244abc6398809171eb323880"`,
    );
    await queryRunner.query(`DROP TABLE "business_packages"`);
  }
}
