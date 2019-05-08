import {MigrationInterface, QueryRunner} from "typeorm";

export class FavoritesFavoritedBy1557276531356 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user_favorites_article" ("userId" integer NOT NULL, "articleId" integer NOT NULL, CONSTRAINT "PK_eb153a9f549f934488deb1c6025" PRIMARY KEY ("userId", "articleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3b80ae56288924ab30cc9e7043" ON "user_favorites_article" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9ea0140751b603ea826c19e1a3" ON "user_favorites_article" ("articleId") `);
        await queryRunner.query(`ALTER TABLE "article" ADD "favoritesCount" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "user_favorites_article" ADD CONSTRAINT "FK_3b80ae56288924ab30cc9e70435" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_favorites_article" ADD CONSTRAINT "FK_9ea0140751b603ea826c19e1a33" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_favorites_article" DROP CONSTRAINT "FK_9ea0140751b603ea826c19e1a33"`);
        await queryRunner.query(`ALTER TABLE "user_favorites_article" DROP CONSTRAINT "FK_3b80ae56288924ab30cc9e70435"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "favoritesCount"`);
        await queryRunner.query(`DROP INDEX "IDX_9ea0140751b603ea826c19e1a3"`);
        await queryRunner.query(`DROP INDEX "IDX_3b80ae56288924ab30cc9e7043"`);
        await queryRunner.query(`DROP TABLE "user_favorites_article"`);
    }

}
