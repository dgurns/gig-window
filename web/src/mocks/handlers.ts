import { graphql } from "msw";
import { seedUsers } from "./seedUsers";
import { seedShows } from "./seedShows";

export const handlers = [
  graphql.query("GetCurrentUser", (_, res, ctx) => {
    return res(
      ctx.data({
        getCurrentUser: seedUsers["1"],
      })
    );
  }),

  graphql.query("GetShows", (_, res, ctx) => {
    return res(
      ctx.data({
        getShows: [seedShows["1"], seedShows["2"]],
      })
    );
  }),

  graphql.query("GetUsersStreamingLive", (_, res, ctx) => {
    return res(
      ctx.data({
        getUsersStreamingLive: [seedUsers["1"], seedUsers["2"]],
      })
    );
  }),
];
