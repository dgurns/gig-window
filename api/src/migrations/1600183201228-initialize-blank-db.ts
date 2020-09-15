import {MigrationInterface, QueryRunner} from "typeorm";

export class initializeBlankDb1600183201228 implements MigrationInterface {
    name = 'initializeBlankDb1600183201228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "user_permissions_enum" AS ENUM('USER', 'ADMIN')`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "permissions" "user_permissions_enum" array DEFAULT '{USER}', "email" character varying NOT NULL, "username" character varying NOT NULL, "urlSlug" character varying NOT NULL, "hashedPassword" character varying NOT NULL, "autoLoginToken" character varying DEFAULT null, "autoLoginTokenExpiry" TIMESTAMP WITH TIME ZONE DEFAULT null, "isAllowedToStream" boolean NOT NULL DEFAULT false, "isInPublicMode" boolean NOT NULL DEFAULT false, "muxLiveStreamId" character varying DEFAULT null, "muxStreamKey" character varying DEFAULT null, "muxPlaybackId" character varying DEFAULT null, "muxLiveStreamStatus" character varying DEFAULT null, "profileImageUrl" character varying DEFAULT null, "stripeCustomerId" character varying DEFAULT null, "stripeConnectAccountId" character varying DEFAULT null, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_c4ba966b65beccb5e8f880c93e0" UNIQUE ("urlSlug"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c4ba966b65beccb5e8f880c93e" ON "user" ("urlSlug") `, undefined);
        await queryRunner.query(`CREATE TABLE "chat" ("id" SERIAL NOT NULL, "userId" integer, "parentUserId" integer, "message" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "show" ("id" SERIAL NOT NULL, "userId" integer, "title" character varying DEFAULT '', "showtime" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e9993c2777c1d0907e845fce4d1" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "amountInCents" integer NOT NULL, "stripePaymentIntentId" character varying NOT NULL, "userId" integer, "payeeUserId" integer, "showId" integer DEFAULT null, "isRefunded" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_52af74c7484586ef4bdfd8e4dbb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_53fde52e81c52a2da94c37d2d5f" FOREIGN KEY ("parentUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "show" ADD CONSTRAINT "FK_e4134800176b09ff8838680c439" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_b046318e0b341a7f72110b75857" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_3aa295e0b2dd61495a1194db0b6" FOREIGN KEY ("payeeUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_3aa295e0b2dd61495a1194db0b6"`, undefined);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_b046318e0b341a7f72110b75857"`, undefined);
        await queryRunner.query(`ALTER TABLE "show" DROP CONSTRAINT "FK_e4134800176b09ff8838680c439"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_53fde52e81c52a2da94c37d2d5f"`, undefined);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_52af74c7484586ef4bdfd8e4dbb"`, undefined);
        await queryRunner.query(`DROP TABLE "payment"`, undefined);
        await queryRunner.query(`DROP TABLE "show"`, undefined);
        await queryRunner.query(`DROP TABLE "chat"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_c4ba966b65beccb5e8f880c93e"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TYPE "user_permissions_enum"`, undefined);
    }

}
