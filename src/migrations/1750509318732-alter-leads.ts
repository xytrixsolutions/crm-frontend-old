import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterLeads1750509318732 implements MigrationInterface {
  name = 'AlterLeads1750509318732';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leads" RENAME COLUMN "vehicle_reg" TO "vehicle_year"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leads" RENAME COLUMN "vehicle_year" TO "vehicle_reg"`,
    );
  }
}
