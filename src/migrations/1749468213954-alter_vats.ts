import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterVats1749468213954 implements MigrationInterface {
  name = 'AlterVats1749468213954';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vats" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "vats" ADD "user_id" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vats" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "vats" ADD "user_id" character varying NOT NULL`,
    );
  }
}
