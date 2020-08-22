import { InputType, ArgsType, Field, Int } from 'type-graphql';

@InputType()
export class GetUserInput {
  @Field((type) => Int, { nullable: true })
  id?: number;

  @Field({ nullable: true })
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

@ArgsType()
export class NewUserEventArgs {
  @Field((type) => Int, { nullable: true })
  userId?: number;

  @Field((type) => String, { nullable: true })
  userUrlSlug?: string;
}
