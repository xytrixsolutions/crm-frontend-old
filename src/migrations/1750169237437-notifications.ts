import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notifications1750169237437 implements MigrationInterface {
  name = 'Notifications1750169237437';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "title" character varying NOT NULL, "body" character varying NOT NULL, "read" boolean NOT NULL DEFAULT false, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, "user_id" integer, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`,
    );
    await queryRunner.query(`DROP TABLE "notifications"`);
  }
}
