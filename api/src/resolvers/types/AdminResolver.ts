import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class UpdateUserIsAllowedToStreamArgs {
  @Field((type) => Int)
  userId: number;

  @Field((type) => Boolean)
  isAllowedToStream: boolean;
}
