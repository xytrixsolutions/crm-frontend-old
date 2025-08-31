import { MigrationInterface, QueryRunner } from 'typeorm';

export class LeadsVrmColumn1748628247243 implements MigrationInterface {
  name = 'LeadsVrmColumn1748628247243';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leads" ADD "vrm" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "leads" DROP COLUMN "vrm"`);
  }
}
