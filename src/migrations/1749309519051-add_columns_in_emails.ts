import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnsInEmails1749309519051 implements MigrationInterface {
  name = 'AddColumnsInEmails1749309519051';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "emails" ADD "model_type" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "emails" ADD "model_id" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "emails" DROP COLUMN "model_id"`);
    await queryRunner.query(`ALTER TABLE "emails" DROP COLUMN "model_type"`);
  }
}
