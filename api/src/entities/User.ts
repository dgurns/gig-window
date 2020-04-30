import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
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
  @Column({ unique: true })
  urlSlug: string;

  @Column()
  hashedPassword: string;

  @Field((type) => String)
  @Column()
  streamKey: string;

  @Field((type) => Boolean)
  @Column({ default: false })
  isPublishingStream: boolean;

  @Field((type) => Date, { nullable: true })
  @Column({ nullable: true, default: null })
  lastPublishedStreamEndTimestamp: Date;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true, default: null })
  liveVideoInfrastructureError: string;

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

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
