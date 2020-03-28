import { InputType, Field } from 'type-graphql';
import { UserRole } from 'entities/User';

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  hashedPassword: string;

  @Field()
  roles: UserRole[];
}
