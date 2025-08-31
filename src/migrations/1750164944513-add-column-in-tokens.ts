import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnInTokens1750164944513 implements MigrationInterface {
  name = 'AddColumnInTokens1750164944513';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD "device_token" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "device_token"`);
  }
}
