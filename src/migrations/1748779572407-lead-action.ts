import { MigrationInterface, QueryRunner } from 'typeorm';

export class LeadAction1748779572407 implements MigrationInterface {
  name = 'LeadAction1748779572407';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lead_actions" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, "lead_id" integer, "user_id" integer, CONSTRAINT "REL_ae65f6cc75409544e01f123c68" UNIQUE ("lead_id"), CONSTRAINT "REL_1eec6bbdab46c57b7c50bc7596" UNIQUE ("user_id"), CONSTRAINT "PK_7f05f5967d7cc770c9263f48e07" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "leads" ADD "lead_action_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "lead_actions" ADD CONSTRAINT "FK_ae65f6cc75409544e01f123c682" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_actions" ADD CONSTRAINT "FK_1eec6bbdab46c57b7c50bc7596e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ADD CONSTRAINT "FK_974371e68da45fa70f9a3f9c505" FOREIGN KEY ("lead_action_id") REFERENCES "lead_actions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leads" DROP CONSTRAINT "FK_974371e68da45fa70f9a3f9c505"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_actions" DROP CONSTRAINT "FK_1eec6bbdab46c57b7c50bc7596e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_actions" DROP CONSTRAINT "FK_ae65f6cc75409544e01f123c682"`,
    );
    await queryRunner.query(`ALTER TABLE "leads" DROP COLUMN "lead_action_id"`);
    await queryRunner.query(`DROP TABLE "lead_actions"`);
  }
}
