import { ArgsType, InputType, Field, Int } from 'type-graphql';

@ArgsType()
export class GetShowsForUserArgs {
  @Field((type) => Int)
  userId: number;

  @Field((type) => Boolean, { nullable: true, defaultValue: true })
  onlyUpcoming?: boolean;
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

@InputType()
export class DeleteShowInput {
  @Field((type) => Int)
  id: number;
}
