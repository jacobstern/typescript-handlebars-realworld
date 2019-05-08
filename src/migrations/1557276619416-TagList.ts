import {MigrationInterface, QueryRunner} from "typeorm";

export class TagList1557276619416 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "article" RENAME COLUMN "tags" TO "tagList"`);
        await queryRunner.query(`ALTER INDEX "article_tags_index" RENAME TO "IDX_43973a2e34e449346fcb19ec5a"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER INDEX "IDX_43973a2e34e449346fcb19ec5a" RENAME TO "article_tags_index"`);
        await queryRunner.query(`ALTER TABLE "article" RENAME COLUMN "tagList" TO "tags"`);
    }

}
