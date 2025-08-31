import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnsInBusinessProfile1749292180959
  implements MigrationInterface
{
  name = 'AddColumnsInBusinessProfile1749292180959';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_profiles" ADD "vat_enabled" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_profiles" ADD "completed" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_profiles" DROP COLUMN "completed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_profiles" DROP COLUMN "vat_enabled"`,
    );
  }
}
