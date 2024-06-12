import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718212299821 implements MigrationInterface {
    name = 'Migration1718212299821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Fields" DROP COLUMN "coordinates"`);
        await queryRunner.query(`ALTER TABLE "Fields" ADD "latitude" character varying`);
        await queryRunner.query(`ALTER TABLE "Fields" ADD "longitude" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Fields" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "Fields" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "Fields" ADD "coordinates" point`);
    }

}
