import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterSales1750081444960 implements MigrationInterface {
  name = 'AlterSales1750081444960';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "invoice_number"`);
    await queryRunner.query(
      `ALTER TABLE "sales" ADD "invoice_number" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "invoice_number"`);
    await queryRunner.query(
      `ALTER TABLE "sales" ADD "invoice_number" character varying NOT NULL`,
    );
  }
}
