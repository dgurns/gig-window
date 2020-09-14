import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Index,
} from 'typeorm';
import { ObjectType, Field, Int, registerEnumType } from 'type-graphql';

export enum UserPermission {
  User = 'USER',
  Admin = 'ADMIN',
}

registerEnumType(UserPermission, {
  name: 'UserPermission',
});

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field((type) => Int)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field((type) => [UserPermission])
  @Column({
    type: 'enum',
    enum: UserPermission,
    array: true,
    nullable: true,
    default: [UserPermission.User],
  })
  permissions: UserPermission[];

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

  @Column()
  autoLoginToken: string;

  @Column({ type: 'timestamptz' })
  autoLoginTokenExpiry: Date;

  @Field((type) => Boolean)
  @Column({ default: false })
  isAllowedToStream: boolean;

  @Field((type) => Boolean)
  @Column({ default: false })
  isInPublicMode: boolean;

  // Mux

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true, default: null })
  muxLiveStreamId?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true, default: null })
  muxStreamKey?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true, default: null })
  muxPlaybackId?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true, default: null })
  muxLiveStreamStatus?:
    | 'created'
    | 'connected'
    | 'recording'
    | 'active'
    | 'disconnected'
    | 'idle'
    | 'updated'
    | 'disabled'
    | 'deleted';

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
