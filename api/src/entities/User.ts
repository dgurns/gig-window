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
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @Field(() => String)
  @Column({ unique: true })
  username: string;

  @Field(() => String)
  @Column({ unique: true })
  urlSlug: string;

  @Column()
  hashedPassword: string;

  @Field(() => String)
  @Column()
  streamKey: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isPublishingStream: boolean;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true, default: null })
  lastPublishedStreamEndTimestamp: Date;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  liveVideoInfrastructureError: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  awsMediaLiveInputId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  awsMediaLiveChannelId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  awsMediaPackageChannelId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  awsMediaPackageChannelIngestUrl: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  awsMediaPackageChannelIngestUsername: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  awsMediaPackageChannelIngestPasswordParam: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  awsMediaPackageOriginEndpointId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  awsMediaPackageOriginEndpointUrl: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
