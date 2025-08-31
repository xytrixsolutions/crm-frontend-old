import { MigrationInterface, QueryRunner } from 'typeorm';

export class Leads1748599400821 implements MigrationInterface {
  name = 'Leads1748599400821';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lead_sources" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "url" character varying NOT NULL, "name" character varying NOT NULL, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, CONSTRAINT "UQ_54dbb044c480833d4fe13ea1662" UNIQUE ("url"), CONSTRAINT "PK_bc885a4409ec70ee5a810dbbd6f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "leads" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "vehicle_model" character varying, "vehicle_reg" character varying, "vehicle_series" character varying, "vehicle_part" character varying, "vehicle_brand" character varying, "vehicle_title" character varying, "part_supplied" character varying NOT NULL, "supply_only" character varying NOT NULL, "consider_both" character varying NOT NULL, "reconditioned_condition" character varying NOT NULL, "used_condition" character varying NOT NULL, "new_condition" character varying NOT NULL, "consider_all_condition" character varying NOT NULL, "vehicle_drive" character varying NOT NULL, "collection_required" character varying NOT NULL, "postcode" character varying NOT NULL, "description" text, "email" character varying NOT NULL, "name" character varying NOT NULL, "number" character varying NOT NULL, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, "lead_source_id" integer, CONSTRAINT "PK_cd102ed7a9a4ca7d4d8bfeba406" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_profiles" DROP CONSTRAINT "FK_1ceee77c549695cfc7c246224ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_profiles" ADD CONSTRAINT "UQ_1ceee77c549695cfc7c246224ef" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_profiles" ADD CONSTRAINT "FK_1ceee77c549695cfc7c246224ef" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ADD CONSTRAINT "FK_cfd3de9ea68bddd4ce4dc2b3d0d" FOREIGN KEY ("lead_source_id") REFERENCES "lead_sources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leads" DROP CONSTRAINT "FK_cfd3de9ea68bddd4ce4dc2b3d0d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_profiles" DROP CONSTRAINT "FK_1ceee77c549695cfc7c246224ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_profiles" DROP CONSTRAINT "UQ_1ceee77c549695cfc7c246224ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_profiles" ADD CONSTRAINT "FK_1ceee77c549695cfc7c246224ef" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP TABLE "leads"`);
    await queryRunner.query(`DROP TABLE "lead_sources"`);
  }
}
