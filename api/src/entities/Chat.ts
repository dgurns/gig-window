import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { RelationColumn } from './entityHelpers';
import { User } from './User';

@Entity()
@ObjectType()
export class Chat extends BaseEntity {
  @Field((type) => Int)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field((type) => User)
  @ManyToOne((type) => User)
  user: User;
  @RelationColumn()
  userId: number;

  @Field((type) => User)
  @ManyToOne((type) => User)
  parentUser: User;
  @RelationColumn()
  parentUserId: number;

  @Field((type) => String)
  @Column()
  message: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
