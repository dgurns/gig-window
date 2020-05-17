import { ArgsType, InputType, Field, Int } from 'type-graphql';
import { User } from 'entities/User';

@ArgsType()
export class GetShowsByUserArgs {
  @Field((type) => Int)
  userId: number;
}

@InputType()
export class CreateShowInput {
  @Field((type) => String, { nullable: true })
  title?: string;

  @Field((type) => String)
  showtimeInUtc: Date;
}

@InputType()
export class UpdateShowInput {
  @Field((type) => Int)
  id: number;

  @Field((type) => String, { nullable: true })
  title?: string;

  @Field((type) => String, { nullable: true })
  showtimeInUtc?: Date;
}
