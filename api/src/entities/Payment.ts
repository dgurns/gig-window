import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { RelationColumn } from './entityHelpers';
import { User } from './User';
import { Show } from './Show';

@Entity()
@ObjectType()
export class Payment extends BaseEntity {
  @Field((type) => Int)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field((type) => Int)
  @Column()
  amountInCents: number;

  @Field((type) => String)
  @Column()
  stripePaymentIntentId: string;

  @Field((type) => User)
  @ManyToOne((type) => User)
  user: User;
  @RelationColumn()
  userId: number;

  @Field((type) => User)
  @ManyToOne((type) => User)
  payeeUser: User;
  @RelationColumn()
  payeeUserId: number;

  @Field((type) => Show, { nullable: true })
  @Column({ default: null })
  showId?: number;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
