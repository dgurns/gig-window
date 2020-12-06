import {MigrationInterface, QueryRunner} from "typeorm";

export class addAboutMarkdown1607253829016 implements MigrationInterface {
    name = 'addAboutMarkdown1607253829016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "aboutMarkdown" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "autoLoginToken" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "autoLoginTokenExpiry" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "muxLiveStreamId" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "muxStreamKey" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "muxPlaybackId" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "muxLiveStreamStatus" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "profileImageUrl" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeConnectAccountId" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "showId" SET DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "showId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeConnectAccountId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "profileImageUrl" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "muxLiveStreamStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "muxPlaybackId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "muxStreamKey" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "muxLiveStreamId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "autoLoginTokenExpiry" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "autoLoginToken" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "aboutMarkdown"`);
    }

}
