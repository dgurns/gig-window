import { Resolver, Query, Mutation, Args, Arg, Ctx, Int } from 'type-graphql';
import { CustomContext } from 'authChecker';
import { Show } from 'entities/Show';
import {
  GetShowsForUserArgs,
  CreateShowInput,
  UpdateShowInput,
} from './types/ShowResolver';

@Resolver()
export class ShowResolver {
  @Query(() => [Show])
  getShowsForUser(@Args() { userId }: GetShowsForUserArgs) {
    return Show.find({
      where: { userId },
      relations: ['user'],
    });
  }

  @Mutation(() => Show)
  async createShow(
    @Arg('data') data: CreateShowInput,
    @Ctx() ctx: CustomContext
  ) {
    const user = ctx.getUser();
    if (!user) throw new Error('User must be logged in to create a show');

    const show = Show.create({
      userId: user.id,
      title: data.title,
      showtimeInUtc: data.showtimeInUtc,
    });
    await show.save();
    return show;
  }

  @Mutation(() => Show)
  async updateShow(
    @Arg('data') data: UpdateShowInput,
    @Ctx() ctx: CustomContext
  ) {
    const user = ctx.getUser();
    if (!user) throw new Error('User must be logged in to update a show');

    const { id, title, showtimeInUtc } = data;
    const show = await Show.findOne({ where: { id } });
    if (!show) {
      throw new Error('Could not find Show with that ID');
    }
    if (title) show.title = title;
    if (showtimeInUtc) show.showtimeInUtc = showtimeInUtc;
    await show.save();
    return show;
  }

  @Mutation(() => Int)
  async deleteShow(@Arg('id') id: number, @Ctx() ctx: CustomContext) {
    const user = ctx.getUser();
    if (!user) throw new Error('User must be logged in to delete a show');

    await Show.delete(id);
    return id;
  }
}
