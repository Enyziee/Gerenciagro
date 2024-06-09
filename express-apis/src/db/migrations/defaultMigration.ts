import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1717915448261 implements MigrationInterface {
    name = 'Migration1717915448261';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(256) NOT NULL, "name" character varying(128) NOT NULL, "password" character varying(60) NOT NULL, "address" character varying(64) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Farms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(256) NOT NULL, "address" character varying(64) NOT NULL, "numberOfFields" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "PK_1a97a61d67918cc6ec605a63bc0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "climate_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "precipitationSum" integer NOT NULL, "fieldId" uuid, CONSTRAINT "PK_b8795c3614a175660e6c090d4f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "defensive_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "agrodefensive" character varying NOT NULL, "fieldId" uuid, CONSTRAINT "PK_bda4a5be90bc71228c73ef473a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Fields" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "coordinates" integer, "name" character varying(32) NOT NULL, "size" real NOT NULL, "farmId" uuid NOT NULL, CONSTRAINT "PK_89a8924caa8f5b039bef740c925" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Farms" ADD CONSTRAINT "FK_c011b23c1805aa320a2c04539e9" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "climate_history" ADD CONSTRAINT "FK_56ea74095cd7ea7502df7a45fa4" FOREIGN KEY ("fieldId") REFERENCES "Fields"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "defensive_history" ADD CONSTRAINT "FK_eb865dbb6175bf5acd9c4bce98f" FOREIGN KEY ("fieldId") REFERENCES "Fields"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Fields" ADD CONSTRAINT "FK_4bcb501fd3bc9f0bcbf8a18c1e9" FOREIGN KEY ("farmId") REFERENCES "Farms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Fields" DROP CONSTRAINT "FK_4bcb501fd3bc9f0bcbf8a18c1e9"`);
        await queryRunner.query(`ALTER TABLE "defensive_history" DROP CONSTRAINT "FK_eb865dbb6175bf5acd9c4bce98f"`);
        await queryRunner.query(`ALTER TABLE "climate_history" DROP CONSTRAINT "FK_56ea74095cd7ea7502df7a45fa4"`);
        await queryRunner.query(`ALTER TABLE "Farms" DROP CONSTRAINT "FK_c011b23c1805aa320a2c04539e9"`);
        await queryRunner.query(`DROP TABLE "Fields"`);
        await queryRunner.query(`DROP TABLE "defensive_history"`);
        await queryRunner.query(`DROP TABLE "climate_history"`);
        await queryRunner.query(`DROP TABLE "Farms"`);
        await queryRunner.query(`DROP TABLE "Users"`);
    }

}
