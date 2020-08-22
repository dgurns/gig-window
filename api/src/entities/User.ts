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
