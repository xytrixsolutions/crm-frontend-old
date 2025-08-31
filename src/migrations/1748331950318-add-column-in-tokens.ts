import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnInTokens1748331950318 implements MigrationInterface {
  name = 'AddColumnInTokens1748331950318';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD "ip_address" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "ip_address"`);
  }
}
