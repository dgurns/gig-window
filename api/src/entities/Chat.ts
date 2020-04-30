import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { User } from './User';

@Entity()
@ObjectType()
export class Chat extends BaseEntity {
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
  @ManyToOne(() => User)
  parentUser: User;

  @Field(() => Int)
  @Column()
  parentUserId: number;

  @Field(() => String)
  @Column()
  message: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
