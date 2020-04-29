import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
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
  @JoinColumn()
  user: User;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn()
  parentUser: User;

  @Field(() => String)
  @Column()
  type: string;

  @Field(() => String)
  @Column({ nullable: true, default: null })
  message?: string;

  @Field(() => Number)
  @Column({ nullable: true, default: null })
  tipAmount?: number;
}
