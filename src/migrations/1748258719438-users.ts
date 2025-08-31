import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1748258719438 implements MigrationInterface {
  name = 'Users1748258719438';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "password" character varying NOT NULL, "role" character varying(50) NOT NULL, "status" character varying(50) NOT NULL, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
