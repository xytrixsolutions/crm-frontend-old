import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterLeads1750681338652 implements MigrationInterface {
  name = 'AlterLeads1750681338652';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "part_supplied" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "supply_only" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "consider_both" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "reconditioned_condition" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "used_condition" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "new_condition" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "consider_all_condition" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "vehicle_drive" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "collection_required" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "collection_required" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "vehicle_drive" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "consider_all_condition" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "new_condition" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "used_condition" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "reconditioned_condition" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "consider_both" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "supply_only" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "part_supplied" SET NOT NULL`,
    );
  }
}
