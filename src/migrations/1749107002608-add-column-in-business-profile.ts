import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnInBusinessProfile1749107002608
  implements MigrationInterface
{
  name = 'AddColumnInBusinessProfile1749107002608';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_profiles" ADD "logo" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_profiles" DROP COLUMN "logo"`,
    );
  }
}
