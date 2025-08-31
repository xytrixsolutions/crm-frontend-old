import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tokens1748262317125 implements MigrationInterface {
  name = 'Tokens1748262317125';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "access_token" character varying NOT NULL, "expires_at" bigint NOT NULL, "refresh_token" character varying NOT NULL, "refresh_token_expires_at" bigint NOT NULL, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, "user_id" integer, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "FK_8769073e38c365f315426554ca5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "FK_8769073e38c365f315426554ca5"`,
    );
    await queryRunner.query(`DROP TABLE "tokens"`);
  }
}
