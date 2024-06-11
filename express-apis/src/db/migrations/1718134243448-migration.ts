import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718134243448 implements MigrationInterface {
    name = 'Migration1718134243448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Fields" DROP COLUMN "coordinates"`);
        await queryRunner.query(`ALTER TABLE "Fields" ADD "coordinates" point`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Fields" DROP COLUMN "coordinates"`);
        await queryRunner.query(`ALTER TABLE "Fields" ADD "coordinates" character varying`);
    }

}
