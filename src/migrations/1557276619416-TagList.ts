import {MigrationInterface, QueryRunner} from "typeorm";

export class TagList1557276619416 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "article_tags_index"`)
        await queryRunner.query(`ALTER TABLE "article" RENAME COLUMN "tags" TO "tagList"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "article" RENAME COLUMN "tagList" TO "tags"`);
        await queryRunner.query(`CREATE INDEX "article_tags_index" ON "article" USING gin (tags)`);    
    }
}
