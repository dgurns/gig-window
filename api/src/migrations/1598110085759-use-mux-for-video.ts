import {MigrationInterface, QueryRunner} from "typeorm";

export class useMuxForVideo1598110085759 implements MigrationInterface {
    name = 'useMuxForVideo1598110085759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "streamKey"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isPublishingStream"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastPublishedStreamStartTimestamp"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastPublishedStreamEndTimestamp"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "liveVideoInfrastructureError"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "awsMediaLiveInputId"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "awsMediaLiveChannelId"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "awsMediaPackageChannelId"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "awsMediaPackageChannelIngestUrl"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "awsMediaPackageChannelIngestUsername"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "awsMediaPackageChannelIngestPasswordParam"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "awsMediaPackageOriginEndpointId"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "awsMediaPackageOriginEndpointUrl"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "awsMediaLiveChannelEnteredRunningStateTimestamp"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "muxLiveStreamId" character varying DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "muxStreamKey" character varying DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "muxPlaybackId" character varying DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "muxLiveStreamStatus" character varying DEFAULT null`, undefined);
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
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "muxLiveStreamStatus"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "muxPlaybackId"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "muxStreamKey"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "muxLiveStreamId"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "awsMediaLiveChannelEnteredRunningStateTimestamp" TIMESTAMP WITH TIME ZONE`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "awsMediaPackageOriginEndpointUrl" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "awsMediaPackageOriginEndpointId" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "awsMediaPackageChannelIngestPasswordParam" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "awsMediaPackageChannelIngestUsername" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "awsMediaPackageChannelIngestUrl" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "awsMediaPackageChannelId" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "awsMediaLiveChannelId" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "awsMediaLiveInputId" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "liveVideoInfrastructureError" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastPublishedStreamEndTimestamp" TIMESTAMP WITH TIME ZONE`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastPublishedStreamStartTimestamp" TIMESTAMP WITH TIME ZONE`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "isPublishingStream" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "streamKey" character varying NOT NULL`, undefined);
    }

}
