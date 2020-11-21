import { ArgsType, InputType, Field, Int } from 'type-graphql';

@ArgsType()
export class GetShowsArgs {
  @Field((type) => String, { nullable: true })
  minShowtime?: string;

  @Field((type) => Int, { nullable: true, defaultValue: 20 })
  take?: number;

  @Field((type) => Int, { nullable: true, defaultValue: 0 })
  skip?: number;
}

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
  showtime: Date;

  @Field((type) => Int, { nullable: true })
  minPriceInCents?: number;
}

@InputType()
export class UpdateShowInput {
  @Field((type) => Int)
  id: number;

  @Field((type) => String, { nullable: true })
  title?: string;

  @Field((type) => String, { nullable: true })
  showtime?: Date;
}

@InputType()
export class DeleteShowInput {
  @Field((type) => Int)
  id: number;
}
