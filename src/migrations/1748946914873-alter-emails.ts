import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterEmails1748946914873 implements MigrationInterface {
  name = 'AlterEmails1748946914873';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "emails" DROP CONSTRAINT "FK_4c1f50332557b4c0adb2c6cac41"`,
    );
    await queryRunner.query(
      `ALTER TABLE "emails" DROP CONSTRAINT "REL_4c1f50332557b4c0adb2c6cac4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "emails" ADD CONSTRAINT "FK_4c1f50332557b4c0adb2c6cac41" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "emails" DROP CONSTRAINT "FK_4c1f50332557b4c0adb2c6cac41"`,
    );
    await queryRunner.query(
      `ALTER TABLE "emails" ADD CONSTRAINT "REL_4c1f50332557b4c0adb2c6cac4" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "emails" ADD CONSTRAINT "FK_4c1f50332557b4c0adb2c6cac41" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
