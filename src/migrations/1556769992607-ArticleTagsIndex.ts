import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArticleTagsIndex1556769992607 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE INDEX "article_tags_index" ON "article" USING gin (tags)'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "article_tags_index"');
  }
}
