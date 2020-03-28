import { AuthChecker } from 'type-graphql';
import { AuthenticateReturn } from 'graphql-passport';
import { Response } from 'express';
import { User } from 'entities/User';

export interface CustomContext {
  isAuthenticated: () => boolean;
  isUnauthenticated: () => boolean;
  getUser: () => User;
  authenticate: (
    strategyName: string,
    options?: object
  ) => Promise<AuthenticateReturn<User>>;
  login: (user: User, options?: object) => Promise<void>;
  logout: () => void;
  res?: Response;
  req: {
    user?: User;
  };
  user?: User;
}

export const authChecker: AuthChecker<CustomContext> = (
  { context: { user } },
  roles
) => {
  if (roles.length === 0) {
    return user !== undefined;
  }

  return false;
};
