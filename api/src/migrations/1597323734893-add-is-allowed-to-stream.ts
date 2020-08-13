import {MigrationInterface, QueryRunner} from "typeorm";

export class addIsAllowedToStream1597323734893 implements MigrationInterface {
    name = 'addIsAllowedToStream1597323734893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isAllowedToStream" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastPublishedStreamStartTimestamp" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastPublishedStreamEndTimestamp" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "liveVideoInfrastructureError" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "awsMediaLiveInputId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "awsMediaLiveChannelId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "awsMediaPackageChannelId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "awsMediaPackageChannelIngestUrl" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "awsMediaPackageChannelIngestUsername" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "awsMediaPackageChannelIngestPasswordParam" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "awsMediaPackageOriginEndpointId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "awsMediaPackageOriginEndpointUrl" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "profileImageUrl" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeAccountId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "showId" SET DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "showId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeAccountId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "profileImageUrl" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "awsMediaPackageOriginEndpointUrl" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "awsMediaPackageOriginEndpointId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "awsMediaPackageChannelIngestPasswordParam" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "awsMediaPackageChannelIngestUsername" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "awsMediaPackageChannelIngestUrl" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "awsMediaPackageChannelId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "awsMediaLiveChannelId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "awsMediaLiveInputId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "liveVideoInfrastructureError" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastPublishedStreamEndTimestamp" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastPublishedStreamStartTimestamp" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isAllowedToStream"`, undefined);
    }

}
