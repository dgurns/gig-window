import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { getManager } from 'typeorm';
import { User } from 'entities/User';
import {
  GetUserInput,
  SignUpInput,
  LogInInput,
} from 'resolvers/types/UserResolver';
import { CustomContext } from 'authChecker';
import LiveVideoInfrastructure from 'services/LiveVideoInfrastructure';
import Stripe from 'services/stripe/Stripe';
import StripeConnect from 'services/stripe/Connect';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  getAllUsers() {
    return User.find();
  }

  @Query(() => User)
  async getUser(@Arg('data') data: GetUserInput) {
    const { id, urlSlug } = data;
    let user;
    if (id) {
      user = await User.findOne({ where: { id } });
    } else if (urlSlug) {
      user = await User.findOne({ where: { urlSlug } });
    }
    if (!user) {
      throw new Error('Could not find user');
    }
    return user;
  }

  @Query(() => User, { nullable: true })
  getCurrentUser(@Ctx() ctx: CustomContext) {
    return ctx.getUser();
  }

  @Query(() => Boolean)
  async checkUserIsStreamingLive(@Ctx() ctx: CustomContext) {
    const user = ctx.getUser();
    if (!user) return false;

    return LiveVideoInfrastructure.checkUserIsStreamingLive(user);
  }

  @Mutation(() => User)
  async signUp(@Arg('data') data: SignUpInput, @Ctx() ctx: CustomContext) {
    const { email, username, password } = data;
    if (!email || !username || !password) {
      throw new Error('Please fill out all the fields');
    }

    const urlSlug = username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    const existingUser = await getManager()
      .createQueryBuilder(User, 'user')
      .where(
        'user.email = :email OR user.username = :username OR user.urlSlug = :urlSlug',
        { email, username, urlSlug }
      )
      .getOne();
    if (existingUser) {
      const emailAlreadyExists = existingUser.email === email;
      throw new Error(
        emailAlreadyExists
          ? 'There is already an account under that email address. Please log in'
          : 'That username is taken, please pick another one'
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const streamKey = uuidv4().replace(/-/g, '');

    const user = User.create({
      email: data.email,
      username: data.username,
      hashedPassword,
      urlSlug,
      streamKey,
    });
    await user.save();

    Stripe.maybeCreateStripeCustomerForUser(user);

    await ctx.login(user);
    return user;
  }

  @Mutation(() => User)
  async logIn(@Arg('data') data: LogInInput, @Ctx() ctx: CustomContext) {
    const { user } = await ctx.authenticate('graphql-local', {
      email: data.email,
      password: data.password,
    });

    if (user) {
      await ctx.login(user);
      return user;
    }
  }

  @Mutation(() => Boolean)
  logOut(@Ctx() ctx: CustomContext) {
    ctx.logout();
    return true;
  }

  @Mutation(() => User)
  async completeStripeConnectOauthFlow(
    @Arg('authorizationCode') authorizationCode: string,
    @Ctx() ctx: CustomContext
  ) {
    const user = ctx.getUser();
    if (!user) {
      throw new Error('User must be logged in to link Stripe account');
    }

    const oauthResponse = await StripeConnect.validateOauthAuthorizationCode(
      authorizationCode
    );
    const stripeAccountId = oauthResponse.stripe_user_id;
    if (stripeAccountId) {
      user.stripeAccountId = stripeAccountId;
      await user.save();
      return user;
    } else {
      throw new Error('Error linking Stripe account. Please try again.');
    }
  }

  @Mutation(() => User)
  async setPublicMode(
    @Arg('publicMode') publicMode: boolean,
    @Ctx() ctx: CustomContext
  ) {
    const user = ctx.getUser();
    if (!user) throw new Error('User is not logged in');

    user.isInPublicMode = publicMode;
    await user.save();
    return user;
  }
}
