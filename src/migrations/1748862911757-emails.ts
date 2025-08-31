import { MigrationInterface, QueryRunner } from 'typeorm';

export class Emails1748862911757 implements MigrationInterface {
  name = 'Emails1748862911757';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "emails" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "email" character varying NOT NULL, "subject" character varying NOT NULL, "body" text NOT NULL, "type" character varying NOT NULL, "sent_at" bigint, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, "user_id" integer, CONSTRAINT "REL_4c1f50332557b4c0adb2c6cac4" UNIQUE ("user_id"), CONSTRAINT "PK_a54dcebef8d05dca7e839749571" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "emails" ADD CONSTRAINT "FK_4c1f50332557b4c0adb2c6cac41" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "emails" DROP CONSTRAINT "FK_4c1f50332557b4c0adb2c6cac41"`,
    );
    await queryRunner.query(`DROP TABLE "emails"`);
  }
}
