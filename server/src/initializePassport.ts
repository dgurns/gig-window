import { GraphQLLocalStrategy } from 'graphql-passport';
import passport from 'passport';
import { User } from 'entities/User';

export const initializePassport = () => {
  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findOne({ where: { id } });
    done(null, user);
  });

  passport.use(
    new GraphQLLocalStrategy(
      async (
        email: unknown,
        password: unknown,
        done: (error: any, user: User | undefined) => void
      ) => {
        const user = await User.findOne({ where: { email } });
        const error = user ? null : new Error('No matching user');
        done(error, user);
      }
    )
  );
};
