import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterLeads1748844192253 implements MigrationInterface {
  name = 'AlterLeads1748844192253';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leads" DROP CONSTRAINT "FK_974371e68da45fa70f9a3f9c505"`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "vrm" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ADD CONSTRAINT "UQ_974371e68da45fa70f9a3f9c505" UNIQUE ("lead_action_id")`,
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
      `ALTER TABLE "leads" DROP CONSTRAINT "UQ_974371e68da45fa70f9a3f9c505"`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ALTER COLUMN "vrm" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ADD CONSTRAINT "FK_974371e68da45fa70f9a3f9c505" FOREIGN KEY ("lead_action_id") REFERENCES "lead_actions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
