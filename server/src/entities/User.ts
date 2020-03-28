import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

export enum UserRole {
  Regular = 'REGULAR',
  Admin = 'ADMIN'
}

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column()
  email: string;

  @Field(() => String)
  @Column()
  username: string;

  @Column()
  hashedPassword: string;

  @Field(() => [String])
  @Column({ default: [UserRole.Regular] })
  roles: UserRole[];
}
