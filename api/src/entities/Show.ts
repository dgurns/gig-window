import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { RelationColumn } from './entityHelpers';
import { User } from './User';

@Entity()
@ObjectType()
export class Show extends BaseEntity {
  @Field((type) => Int)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field((type) => User)
  @ManyToOne((type) => User)
  user: User;
  @RelationColumn()
  userId: number;

  @Field(() => String)
  @Column({ nullable: true, default: '' })
  title: string;

  @Field()
  @Column()
  showtimeInUtc: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
