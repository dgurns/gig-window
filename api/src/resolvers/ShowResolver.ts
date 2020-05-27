import { Resolver, Query, Mutation, Args, Arg, Ctx, Int } from 'type-graphql';
import { getManager } from 'typeorm';
import subMinutes from 'date-fns/subMinutes';
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
    // TODO: This date comparison logic is specific to SQLite due to
    //       how it stores date fields. Update it for Postgres
    const dateIncludingGracePeriod = subMinutes(new Date(), 240);
    const dateToCompareAsSqliteString = dateIncludingGracePeriod
      .toISOString()
      .replace('T', ' ');
    const shows = await getManager()
      .createQueryBuilder(Show, 'show')
      .where('show.userId = :userId', { userId })
      .andWhere(onlyUpcoming ? 'show.showtime > :now' : 'show.showtime', {
        now: dateToCompareAsSqliteString,
      })
      .orderBy('show.showtime', 'ASC')
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
      showtime: data.showtime,
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

    const { id, title, showtime } = data;
    const show = await Show.findOne({ where: { id } });
    if (!show) {
      throw new Error('Could not find Show with that ID');
    }
    if (title) show.title = title;
    if (showtime) show.showtime = showtime;
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