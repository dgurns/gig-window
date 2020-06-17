import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { getManager, Not } from 'typeorm';
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
import AwsS3 from 'services/aws/S3';
import UserService from 'services/User';

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

    if (!UserService.isValidEmail(email)) {
      throw new Error('Invalid email address');
    }
    if (!UserService.isSecurePassword(password)) {
      throw new Error(
        'Password must be at least 8 characters and contain a number'
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

  @Mutation(() => String)
  async generatePresignedImageUploadUrl(@Ctx() ctx: CustomContext) {
    const user = ctx.getUser();
    if (!user) throw new Error('User is not logged in');

    const s3Key = UserService.generateProfileImageAwsS3Key(user.id);
    const presignedUrl = await AwsS3.getSignedPutUrl(s3Key);
    return presignedUrl;
  }

  @Mutation(() => User)
  async markProfileImageAsUploaded(@Ctx() ctx: CustomContext) {
    const user = ctx.getUser();
    if (!user) throw new Error('User is not logged in');

    const s3Key = UserService.generateProfileImageAwsS3Key(user.id);
    const url = AwsS3.getFullS3Url(s3Key);

    user.profileImageUrl = url;
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
