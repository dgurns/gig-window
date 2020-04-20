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
  @Column({ nullable: true, default: null })
  awsMediaLiveInputId: string;

  @Field(() => String)
  @Column({ nullable: true, default: null })
  awsMediaLiveChannelId: string;

  @Field(() => String)
  @Column({ nullable: true, default: null })
  awsMediaPackageChannelId: string;
}
