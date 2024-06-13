import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718214893027 implements MigrationInterface {
    name = 'Migration1718214893027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "climate_history" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "climate_history" ADD "timestamp" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "climate_history" DROP CONSTRAINT "FK_56ea74095cd7ea7502df7a45fa4"`);
        await queryRunner.query(`ALTER TABLE "climate_history" ALTER COLUMN "fieldId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "climate_history" ADD CONSTRAINT "FK_56ea74095cd7ea7502df7a45fa4" FOREIGN KEY ("fieldId") REFERENCES "Fields"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "climate_history" DROP CONSTRAINT "FK_56ea74095cd7ea7502df7a45fa4"`);
        await queryRunner.query(`ALTER TABLE "climate_history" ALTER COLUMN "fieldId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "climate_history" ADD CONSTRAINT "FK_56ea74095cd7ea7502df7a45fa4" FOREIGN KEY ("fieldId") REFERENCES "Fields"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "climate_history" DROP COLUMN "timestamp"`);
        await queryRunner.query(`ALTER TABLE "climate_history" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
