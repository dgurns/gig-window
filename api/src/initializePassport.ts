import bcrypt from 'bcrypt';
import { GraphQLLocalStrategy } from 'graphql-passport';
import passport from 'passport';
import { User } from 'entities/User';

export const initializePassport = () => {
  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(
      async (
        email: unknown,
        password: unknown,
        done: (error: any, user: User | undefined) => void
      ) => {
        const user = await User.findOne({ where: { email } });

        if (!user) {
          return done(
            new Error('No user found with that email address'),
            undefined
          );
        }

        const passwordIsValid = await bcrypt.compare(
          password,
          user.hashedPassword
        );

        if (passwordIsValid) {
          return done(null, user);
        } else {
          return done(new Error('Invalid password'), undefined);
        }
      }
    )
  );
};
