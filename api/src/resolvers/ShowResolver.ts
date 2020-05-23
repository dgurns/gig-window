import { Resolver, Query, Mutation, Args, Arg, Ctx, Int } from 'type-graphql';
import { getManager } from 'typeorm';
import { CustomContext } from 'authChecker';
import { Show } from 'entities/Show';
import {
  GetShowsForUserArgs,
  CreateShowInput,
  UpdateShowInput,
  DeleteShowInput,
} from './types/ShowResolver';

@Resolver()
export class ShowResolver {
  @Query(() => [Show])
  async getShowsForUser(@Args() { userId, onlyUpcoming }: GetShowsForUserArgs) {
    const shows = await getManager()
      .createQueryBuilder(Show, 'show')
      .where('show.userId = :userId', { userId })
      .andWhere(
        onlyUpcoming ? 'show.showtimeInUtc >= :now' : 'show.showtimeInUtc',
        {
          now: new Date().toISOString(),
        }
      )
      .orderBy('show.showtimeInUtc', 'ASC')
      .getMany();
    return shows;
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
  async deleteShow(
    @Arg('data') { id }: DeleteShowInput,
    @Ctx() ctx: CustomContext
  ) {
    const user = ctx.getUser();
    if (!user) throw new Error('User must be logged in to delete a show');

    await Show.delete(id);
    return id;
  }
}
