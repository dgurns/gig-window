import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import {
  Resolver,
  Query,
  Mutation,
  Subscription,
  Arg,
  Args,
  Root,
  Ctx,
  PubSub,
  Publisher,
} from 'type-graphql';
import { getManager } from 'typeorm';
import addMinutes from 'date-fns/addMinutes';

import { User } from 'entities/User';
import {
  GetUserInput,
  NewUserEventArgs,
  SignUpInput,
  LogInInput,
} from 'resolvers/types/UserResolver';
import { CustomContext } from 'authChecker';

import Stripe from 'services/stripe/Stripe';
import StripeConnect from 'services/stripe/Connect';
import AwsS3 from 'services/aws/S3';
import Mux from 'services/Mux';
import Mailer from 'services/Mailer';
import UserService from 'services/User';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async searchUsers(
    @Arg('searchTerm', { nullable: true, defaultValue: '' }) searchTerm: string,
    @Arg('limit', { nullable: true, defaultValue: 20 }) limit?: number,
    @Arg('offset', { nullable: true, defaultValue: 0 }) offset?: number
  ) {
    const response = await getManager()
      .createQueryBuilder(User, 'user')
      .select()
      .where('user.username ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .take(limit)
      .skip(offset)
      .orderBy('user.createdAt', 'DESC')
      .getMany();
    return response;
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

  @Query(() => [User])
  async getUsersStreamingLive() {
    const usersStreamingLive = await User.find({
      where: {
        isInPublicMode: true,
        muxLiveStreamStatus: 'active',
      },
    });
    return usersStreamingLive;
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

    if (!UserService.isValidEmail(email)) {
      throw new Error('Invalid email address');
    }
    if (!UserService.isSecurePassword(password)) {
      throw new Error('Password must be at least 6 characters');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = User.create({
      email: data.email,
      username: data.username,
      hashedPassword,
      urlSlug,
    });
    await user.save();

    await Promise.all([
      Mux.createLiveStreamForUser(user),
      Stripe.maybeCreateStripeCustomerForUser(user),
    ]);

    await ctx.login(user);
    return user;
  }

  @Mutation(() => User)
  async logIn(@Arg('data') data: LogInInput, @Ctx() ctx: CustomContext) {
    const { user } = await ctx.authenticate('graphql-local', {
      email: data.email,
      password: data.password,
    });

    if (!user) {
      throw new Error('Could not log in, please double-check and try again.');
    }

    if (!user.muxLiveStreamId) {
      await Mux.createLiveStreamForUser(user);
    }
    await ctx.login(user);
    return user;
  }

  @Mutation(() => Boolean)
  logOut(@Ctx() ctx: CustomContext) {
    ctx.logout();
    return true;
  }

  @Mutation(() => String)
  async sendEmailWithAutoLoginUrl(@Arg('email') email: string) {
    if (!email || !UserService.isValidEmail(email)) {
      throw new Error('Please provide a valid email address');
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return email;
    }
    user.autoLoginToken = uuid();
    user.autoLoginTokenExpiry = addMinutes(new Date(), 15);
    await user.save();

    await Mailer.sendEmailWithAutoLoginUrl(user);

    return email;
  }

  @Mutation(() => User)
  async logInWithAutoLoginToken(
    @Arg('token') token: string,
    @Ctx() ctx: CustomContext
  ) {
    if (!token) throw new Error('No auto-login token provided');

    const user = await User.findOne({ where: { autoLoginToken: token } });
    if (!user || !user.autoLoginTokenExpiry) {
      throw new Error('Invalid auto-login token');
    }

    const tokenExpiry = new Date(user.autoLoginTokenExpiry);
    if (tokenExpiry > new Date()) {
      await ctx.login(user);
      return user;
    } else {
      throw new Error('This auto-login token has expired');
    }
  }

  @Mutation(() => User)
  async regenerateLiveStreamConfigForUser(@Ctx() ctx: CustomContext) {
    const user = ctx.getUser();
    if (!user) throw new Error('User is not logged in');

    await Mux.createLiveStreamForUser(user);
    return user;
  }

  @Mutation(() => String)
  async generatePresignedImageUploadUrl(@Ctx() ctx: CustomContext) {
    const user = ctx.getUser();
    if (!user) throw new Error('User is not logged in');

    const s3Key = UserService.buildProfileImageAwsS3Key(user.id);
    const presignedUrl = await AwsS3.getSignedPutUrl(s3Key);
    return presignedUrl;
  }

  @Mutation(() => User)
  async updateProfileImageUrl(
    @Arg('profileImageUrl') profileImageUrl: string,
    @Ctx() ctx: CustomContext
  ) {
    const user = ctx.getUser();
    if (!user) throw new Error('User is not logged in');

    // Add `updated` param to invalidate cache on changed image
    user.profileImageUrl = `${profileImageUrl}?updated=${Date.now()}`;
    await user.save();
    return user;
  }

  @Mutation(() => User)
  async updateEmail(@Arg('email') email: string, @Ctx() ctx: CustomContext) {
    const user = ctx.getUser();
    if (!user) throw new Error('User is not logged in');

    if (email === user.email) throw new Error('This is already your email');

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      throw new Error('That email is being used on another account');

    if (!UserService.isValidEmail(email))
      throw new Error('Invalid email address');

    user.email = email;
    await user.save();
    return user;
  }

  @Mutation(() => User)
  async updateUsername(
    @Arg('username') username: string,
    @Ctx() ctx: CustomContext
  ) {
    const user = ctx.getUser();
    if (!user) throw new Error('User is not logged in');

    if (username === user.username) {
      throw new Error('This is already your username');
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) throw new Error('That username is already in use');

    user.username = username;
    await user.save();
    return user;
  }

  @Mutation(() => User)
  async updateUrlSlug(
    @Arg('urlSlug') urlSlug: string,
    @Ctx() ctx: CustomContext
  ) {
    const user = ctx.getUser();
    if (!user) throw new Error('User is not logged in');

    if (urlSlug === user.urlSlug) {
      throw new Error('This is already your custom URL');
    }
    const isLowercaseLetters = new RegExp(/^[a-z]+$/).test(urlSlug);
    if (!isLowercaseLetters) {
      throw new Error('Custom URL can only contain lowercase letters');
    }
    if (urlSlug.length > 30) {
      throw new Error('Custom URL must be less than 30 characters');
    }

    const existingUser = await User.findOne({ where: { urlSlug } });
    if (existingUser) throw new Error('That custom URL is already in use');

    user.urlSlug = urlSlug;
    await user.save();
    return user;
  }

  @Mutation(() => User)
  async updateAboutMarkdown(
    @Arg('aboutMarkdown') aboutMarkdown: string,
    @Ctx() ctx: CustomContext
  ) {
    const user = ctx.getUser();
    if (!user) throw new Error('User is not logged in');

    if (aboutMarkdown === user.aboutMarkdown) {
      throw new Error('This is the same as your existing About text');
    }

    user.aboutMarkdown = aboutMarkdown;
    await user.save();
    return user;
  }

  @Mutation(() => User)
  async updatePassword(
    @Arg('password') password: string,
    @Ctx() ctx: CustomContext
  ) {
    const user = ctx.getUser();
    if (!user) throw new Error('User is not logged in');

    if (!UserService.isSecurePassword(password)) {
      throw new Error(
        'Password must be at least 8 characters and contain a number'
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.hashedPassword = hashedPassword;
    await user.save();
    return user;
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
    const stripeConnectAccountId = oauthResponse.stripe_user_id;
    if (stripeConnectAccountId) {
      user.stripeConnectAccountId = stripeConnectAccountId;
      await user.save();
      return user;
    } else {
      throw new Error('Error linking Stripe account. Please try again.');
    }
  }

  @Mutation(() => User)
  async unlinkStripeConnectAccount(@Ctx() ctx: CustomContext) {
    const user = ctx.getUser();
    if (!user) throw new Error('User is not logged in');

    user.stripeConnectAccountId = '';
    await user.save();
    return user;
  }

  @Mutation(() => User)
  async setPublicMode(
    @Arg('publicMode') publicMode: boolean,
    @Ctx() ctx: CustomContext,
    @PubSub('PUBLIC_MODE_UPDATED') publish: Publisher<User>
  ) {
    const user = ctx.getUser();
    if (!user) throw new Error('User is not logged in');

    user.isInPublicMode = publicMode;
    await user.save();

    await publish(user);

    return user;
  }

  @Subscription({
    topics: ['PUBLIC_MODE_UPDATED', 'MUX_LIVE_STREAM_STATUS_UPDATED'],
    filter: ({ payload, args }) => {
      if (payload.id === args.userId || payload.urlSlug === args.userUrlSlug) {
        return true;
      }
      return false;
    },
  })
  newUserEvent(
    @Root() payload: User,
    @Args() { userId, userUrlSlug }: NewUserEventArgs
  ): User {
    return payload;
  }
}
