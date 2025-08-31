import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterLeadActions1748874267310 implements MigrationInterface {
  name = 'AlterLeadActions1748874267310';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead_actions" DROP CONSTRAINT "FK_ae65f6cc75409544e01f123c682"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_actions" DROP CONSTRAINT "FK_1eec6bbdab46c57b7c50bc7596e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_actions" DROP CONSTRAINT "REL_ae65f6cc75409544e01f123c68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_actions" DROP CONSTRAINT "REL_1eec6bbdab46c57b7c50bc7596"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_actions" ADD CONSTRAINT "FK_ae65f6cc75409544e01f123c682" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_actions" ADD CONSTRAINT "FK_1eec6bbdab46c57b7c50bc7596e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead_actions" DROP CONSTRAINT "FK_1eec6bbdab46c57b7c50bc7596e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_actions" DROP CONSTRAINT "FK_ae65f6cc75409544e01f123c682"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_actions" ADD CONSTRAINT "REL_1eec6bbdab46c57b7c50bc7596" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_actions" ADD CONSTRAINT "REL_ae65f6cc75409544e01f123c68" UNIQUE ("lead_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_actions" ADD CONSTRAINT "FK_1eec6bbdab46c57b7c50bc7596e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_actions" ADD CONSTRAINT "FK_ae65f6cc75409544e01f123c682" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
