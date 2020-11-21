import { Resolver, Query, Mutation, Args, Arg, Ctx, Int } from 'type-graphql';
import { getManager, MoreThan } from 'typeorm';
import subMinutes from 'date-fns/subMinutes';
import { CustomContext } from 'authChecker';
import { Show } from 'entities/Show';
import {
  GetShowsArgs,
  GetShowsForUserArgs,
  CreateShowInput,
  UpdateShowInput,
  DeleteShowInput,
} from './types/ShowResolver';

@Resolver()
export class ShowResolver {
  @Query(() => [Show])
  async getShows(@Args() { minShowtime, take, skip }: GetShowsArgs) {
    const minimumShowtime = minShowtime ? new Date(minShowtime) : new Date();
    const dateToCompareAsSqlString = minimumShowtime
      .toISOString()
      .replace('T', ' ');
    const shows = await Show.find({
      where: { showtime: MoreThan(dateToCompareAsSqlString) },
      relations: ['user'],
      order: {
        showtime: 'ASC',
      },
      take,
      skip,
    });
    return shows;
  }

  @Query(() => [Show])
  async getShowsForUser(@Args() { userId, onlyUpcoming }: GetShowsForUserArgs) {
    const dateIncludingGracePeriod = subMinutes(new Date(), 240);
    const dateToCompareAsSqlString = dateIncludingGracePeriod
      .toISOString()
      .replace('T', ' ');
    const shows = await getManager()
      .createQueryBuilder(Show, 'show')
      .where('show.userId = :userId', { userId })
      .andWhere(onlyUpcoming ? 'show.showtime > :now' : 'show.showtime', {
        now: dateToCompareAsSqlString,
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
    if (data.minPriceInCents === 0) {
      throw new Error('Minimum price must be at least $1');
    }

    const show = Show.create({
      userId: user.id,
      title: data.title,
      showtime: data.showtime,
      minPriceInCents: data.minPriceInCents,
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

    const { id, title, showtime, minPriceInCents } = data;
    const show = await Show.findOne({ where: { id } });
    if (!show) {
      throw new Error('Could not find Show with that ID');
    } else if (minPriceInCents === 0) {
      throw new Error('Minimum price must be at least $1');
    }

    if (title) show.title = title;
    if (showtime) show.showtime = showtime;
    if (minPriceInCents) show.minPriceInCents = minPriceInCents;
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
