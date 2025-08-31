import { MigrationInterface, QueryRunner } from 'typeorm';

export class VehicleDetails1748614481880 implements MigrationInterface {
  name = 'VehicleDetails1748614481880';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "vehicle_details" ("id" SERIAL NOT NULL, "vrm" character varying NOT NULL, "basic_data" json, "detailed_data" json, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, CONSTRAINT "UQ_5bf8244ca477850b9774d6a708f" UNIQUE ("vrm"), CONSTRAINT "PK_3cc9af53df613bb5a9cfe331ae0" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "vehicle_details"`);
  }
}
