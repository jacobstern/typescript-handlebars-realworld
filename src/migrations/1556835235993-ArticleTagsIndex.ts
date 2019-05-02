import {MigrationInterface, QueryRunner} from "typeorm";

export class ArticleTagsIndex1556835235993 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE INDEX "article_tags_index" ON "article" USING gin (tags)`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "article_tags_index"`);
    }

}
