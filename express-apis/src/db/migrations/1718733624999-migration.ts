import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718733624999 implements MigrationInterface {
    name = 'Migration1718733624999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "RefreshTokens" DROP COLUMN "valid"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "RefreshTokens" ADD "valid" boolean NOT NULL`);
    }

}
