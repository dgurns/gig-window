import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { User } from './User';

export enum ChatEventType {
  Message = 'message',
  Tip = 'tip',
}

@Entity()
@ObjectType()
export class ChatEvent extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User)
  user: User;

  @Field(() => Int)
  @Column()
  userId: number;

  @Field(() => User)
  @ManyToOne((type) => User)
  parentUser: User;

  @Field(() => Int)
  @Column()
  parentUserId: number;

  @Field(() => String)
  @Column()
  type: string;

  @Field(() => String)
  @Column({ nullable: true, default: null })
  message?: string;
}
