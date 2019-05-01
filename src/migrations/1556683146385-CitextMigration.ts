import { MigrationInterface, QueryRunner } from 'typeorm';

export class CitextMigration1556683146385 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION citext');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP EXTENSION citext');
  }
}
