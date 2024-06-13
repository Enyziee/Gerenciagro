import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718216925516 implements MigrationInterface {
    name = 'Migration1718216925516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "climate_history" ALTER COLUMN "timestamp" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "climate_history" DROP COLUMN "precipitationSum"`);
        await queryRunner.query(`ALTER TABLE "climate_history" ADD "precipitationSum" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "climate_history" DROP COLUMN "precipitationSum"`);
        await queryRunner.query(`ALTER TABLE "climate_history" ADD "precipitationSum" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "climate_history" ALTER COLUMN "timestamp" DROP NOT NULL`);
    }

}
