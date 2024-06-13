import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718250602252 implements MigrationInterface {
    name = 'Migration1718250602252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "defensive_history" ADD "volume" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "defensive_history" DROP COLUMN "volume"`);
    }
    
}
