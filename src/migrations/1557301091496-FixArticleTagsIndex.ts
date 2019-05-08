import {MigrationInterface, QueryRunner} from "typeorm";

export class FixArticleTagsIndex1557301091496 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE INDEX "article_tags_index" ON "article" USING gin ("tagList")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "article_tags_index"`);
    }
}
