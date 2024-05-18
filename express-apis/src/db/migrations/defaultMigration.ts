import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1716067553329 implements MigrationInterface {
	name = 'Migration1716067553329';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(256) NOT NULL, "name" character varying(128) NOT NULL, "password" character varying(60) NOT NULL, "address" character varying(64) NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "farm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(256) NOT NULL, "address" character varying(64) NOT NULL, "userId" uuid, CONSTRAINT "PK_3bf246b27a3b6678dfc0b7a3f64" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "field" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(32) NOT NULL, "size" real NOT NULL, "farmId" uuid, CONSTRAINT "PK_39379bba786d7a75226b358f81e" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "farm" ADD CONSTRAINT "FK_fe2fe67c9ca2dc03fff76cd04a9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "field" ADD CONSTRAINT "FK_0a0f7ebfc798343ecae66920c3e" FOREIGN KEY ("farmId") REFERENCES "farm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "field" DROP CONSTRAINT "FK_0a0f7ebfc798343ecae66920c3e"`);
		await queryRunner.query(`ALTER TABLE "farm" DROP CONSTRAINT "FK_fe2fe67c9ca2dc03fff76cd04a9"`);
		await queryRunner.query(`DROP TABLE "field"`);
		await queryRunner.query(`DROP TABLE "farm"`);
		await queryRunner.query(`DROP TABLE "user"`);
	}
}
