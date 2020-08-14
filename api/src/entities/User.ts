import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Index,
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field((type) => Int)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field((type) => String)
  @Column({ unique: true })
  email: string;

  @Field((type) => String)
  @Column({ unique: true })
  username: string;

  @Field((type) => String)
  @Index({ unique: true })
  @Column({ unique: true })
  urlSlug: string;

  @Column()
  hashedPassword: string;

  @Field((type) => Boolean)
  @Column({ default: false })
  isAllowedToStream: boolean;

  @Field((type) => String)
  @Column()
  streamKey: string;

  // Video infrastructure

  @Field((type) => Boolean)
  @Column({ default: false })
  isPublishingStream: boolean;

  @Field((type) => Boolean)
  @Column({ default: false })
  isInPublicMode: boolean;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true, default: null })
  lastPublishedStreamStartTimestamp: Date;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true, default: null })
  lastPublishedStreamEndTimestamp: Date;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true, default: null })
  liveVideoInfrastructureError: string;

  // AWS Media Services

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true, default: null })
  awsMediaLiveInputId: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true, default: null })
  awsMediaLiveChannelId: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true, default: null })
  awsMediaPackageChannelId: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true, default: null })
  awsMediaPackageChannelIngestUrl: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true, default: null })
  awsMediaPackageChannelIngestUsername: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true, default: null })
  awsMediaPackageChannelIngestPasswordParam: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true, default: null })
  awsMediaPackageOriginEndpointId: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true, default: null })
  awsMediaPackageOriginEndpointUrl: string;

  // AWS S3

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true, default: null })
  profileImageUrl: string;

  // Stripe

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true, default: null })
  stripeCustomerId: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true, default: null })
  stripeConnectAccountId: string;

  // User record meta

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
