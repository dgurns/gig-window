import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

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

  @Field(() => String)
  @Column({ default: '' })
  awsMediaLiveInputId: string;

  @Field(() => String)
  @Column({ default: '' })
  awsMediaLiveChannelId: string;

  @Field(() => String)
  @Column({ default: '' })
  awsMediaPackageChannelId: string;

  @Field(() => String)
  @Column({ default: '' })
  awsMediaPackageChannelIngestUrl: string;

  @Field(() => String)
  @Column({ default: '' })
  awsMediaPackageChannelIngestUsername: string;

  @Field(() => String)
  @Column({ default: '' })
  awsMediaPackageChannelIngestPasswordParam: string;
}
