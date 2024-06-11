import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718081577709 implements MigrationInterface {
    name = 'Migration1718081577709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Fields" DROP COLUMN "coordinates"`);
        await queryRunner.query(`ALTER TABLE "Fields" ADD "coordinates" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Fields" DROP COLUMN "coordinates"`);
        await queryRunner.query(`ALTER TABLE "Fields" ADD "coordinates" integer`);
    }

}
