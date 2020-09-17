import { AuthChecker } from 'type-graphql';
import { AuthenticateReturn } from 'graphql-passport';
import { Response } from 'express';
import { User, UserPermission } from 'entities/User';

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
    session: CookieSessionInterfaces.CookieSessionObject;
  };
}

export const authChecker: AuthChecker<CustomContext> = (
  { root, context },
  requiredRoles
) => {
  const user = context.req?.user;

  // If there is no user in context, the request is not authorized
  if (!user) {
    return false;
  }
  // If user is an Admin, give access to everything
  if (user.permissions.includes(UserPermission.Admin)) {
    return true;
  }
  // If the auth requires Admin, return user's admin status
  if (requiredRoles.includes(UserPermission.Admin)) {
    return user.permissions.includes(UserPermission.Admin);
  }
  // Otherwise, only return entities associated with current user
  // For now, we're only checking User entities
  if (root instanceof User) {
    return root.id === user.id;
  }

  return false;
};
