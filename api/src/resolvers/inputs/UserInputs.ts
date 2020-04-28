import { InputType, Field } from 'type-graphql';

@InputType()
export class GetUserInput {
  @Field()
  id?: number;

  @Field()
  urlSlug?: string;
}

@InputType()
export class SignUpInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}

@InputType()
export class LogInInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
