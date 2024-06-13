import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718303507435 implements MigrationInterface {
    name = 'Migration1718303507435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "RefreshTokens" ("token" character varying NOT NULL, "valid" boolean NOT NULL, "issuedAt" TIMESTAMP NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "userId" uuid, CONSTRAINT "PK_db56120664dd9acb3c8ae67a42e" PRIMARY KEY ("token"))`);
        await queryRunner.query(`ALTER TABLE "RefreshTokens" ADD CONSTRAINT "FK_6dfd786f75cfe054e9ae3a45f5e" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "RefreshTokens" DROP CONSTRAINT "FK_6dfd786f75cfe054e9ae3a45f5e"`);
        await queryRunner.query(`DROP TABLE "RefreshTokens"`);
    }

}
