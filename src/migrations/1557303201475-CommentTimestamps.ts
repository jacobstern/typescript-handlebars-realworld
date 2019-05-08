import {MigrationInterface, QueryRunner} from "typeorm";

export class CommentTimestamps1557303201475 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "createdAt"`);
    }

}
