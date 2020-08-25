import {MigrationInterface, QueryRunner} from "typeorm";

export class useEnumArrayInPostgres1598377707708 implements MigrationInterface {
    name = 'useEnumArrayInPostgres1598377707708'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "permissions"`, undefined);
        await queryRunner.query(`CREATE TYPE "user_permissions_enum" AS ENUM('USER', 'ADMIN')`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "permissions" "user_permissions_enum" array DEFAULT '{USER}'`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "muxLiveStreamId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "muxStreamKey" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "muxPlaybackId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "muxLiveStreamStatus" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "profileImageUrl" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeConnectAccountId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "showId" SET DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "showId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeConnectAccountId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "profileImageUrl" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "muxLiveStreamStatus" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "muxPlaybackId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "muxStreamKey" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "muxLiveStreamId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "permissions"`, undefined);
        await queryRunner.query(`DROP TYPE "user_permissions_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "permissions" text DEFAULT '["USER"]'`, undefined);
    }

}
