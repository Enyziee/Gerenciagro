import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718391477757 implements MigrationInterface {
    name = 'Migration1718391477757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "RefreshTokens" DROP COLUMN "issuedAt"`);
        await queryRunner.query(`ALTER TABLE "RefreshTokens" ADD "issuedAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "RefreshTokens" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "RefreshTokens" ADD "expiresAt" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "RefreshTokens" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "RefreshTokens" ADD "expiresAt" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "RefreshTokens" DROP COLUMN "issuedAt"`);
        await queryRunner.query(`ALTER TABLE "RefreshTokens" ADD "issuedAt" integer NOT NULL`);
    }

}
