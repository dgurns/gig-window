# Post Mortem for GigWindow

This was by far the most I've ever learned doing a project. Database design, deployment, server management, AWS APIs, client-side vs. static rendering, TypeScript, ORMs, Docker, DNS... the list goes on.

Of course, very few people actually _used it_. But solely for the fun and the learning, I consider this project a big success.

## Good decisions:
- TypeScript
  - Used it on the frontend and backend
  - So so good to know the exact shape of every object throughout the app
  - Forced me to think about core data types and what each function's purpose is
- PostgreSQL
  - Had every feature I needed
  - Super stable
  - Well supported by deployment providers
- React
  - Rock solid
  - Well maintained with hugely active community including on StackOverflow
  - Function components and hooks are great now that I'm used to them
- Apollo Client
  - Made it super easy to fetch and cache data
  - Excellent TypeScript support
- TypeORM + TypeGraphQL
  - I really like their use of decorators to define models in one place, for use in GraphQL resolvers and for accessing the DB
  - Not completely sold on using an ORM to be honest (more explanation later), but if you're going to use one and you're using TypeScript + GraphQL, this is
  a very clean solution.
  - TypeORM is nice and flexible for writing raw queries when need be, and makes it easy to generate and run migrations
- DigitalOcean
  - Rock solid and cheap
  - Much more transparent pricing model than AWS
  - Nice cloud dashboard
- Vercel
  - Also rock solid... and free
  - Amazing developer experience
- AWS RDS PostgreSQL
  - Had no issues whatsoever
- Stripe
  - Absolutely world class API and docs
  - Can't say enough good things about it

## So-so decisions
- ORM
  - I'm honestly not sure how much effort this saved me compared to just writing raw SQL queries with `knex` or something
  - Relations with TypeORM were a pain
  - I considered using Prisma but they have made so many drastic product changes in the past that I was wary of them
- Building my own websocket server
  - This was a hassle for configuring across environments
  - Not sure how well this would have scaled past a few hundred users
  - The SaaS alternatives were expensive, for example Pusher, so I didn't think it was worth it. Even now, I'm not sure it would have been worth it.
  - Now that Cloudflare Durable Objects is out, that would definitely be worth a look.
- Using Create React App instead of NextJS
  - I was a little wary of getting locked in to NextJS in case Vercel pulls some kind of funky VC-backed move towards lock-in
  - But NextJS is open source and can be deployed on any provider
  - And it gives fantastic config out of the box, which would have saved me tons of time. Stuff like static site generation, built-in TypeScript support, much better routing system than React Router.
  - Even though I probably should have just used NextJS, CRA was totally fine.
- Using a Git Flow development model 
  - This means doing new feature branches and merging them into `develop` via PR, then doing manual releases to `master`
  - I should have used GitHub Flow and merged every PR into `master`, with preview deployments per PR
  - It would have required more CI/CD config but I think it would have been cleaner and made releases less of a chore

## Terrible decisions
- Material UI
  - I'm so mad at myself for picking this
  - Doing styles in JS is just horrible
  - Almost impossible to get down to the raw HTML markup level
  - Very difficult to customize Material UI components across a project
  - I'm using Tailwind in another project and I like it way better
  - And to be honest, I might even like simple SCSS the best. Hard to beat the clean separation of concerns. Tailwind is nice and quick to iterate though.
  - This decision was an absolute killer because Material UI is hard to tear out once a project is underway
- Not testing with users before finishing the v1
  - You'd think I would have learned this lesson from being a startup founder, but no!
  - Since Concert Window had succeeded and I thought I had a good handle on the feature set, I just rebuilt a "better" version of it
  - But things have changed a ton in the past 10 years - which is like 100 years in the Internet world
  - So even though what I built worked much better than Concert Window did, it wasn't the right product for the market. Musicians started performing on Facebook during the pandemic lockdowns since that's where their audience is. My best guess is that they didn't want to bring their audiences to an outside site to do a show; and perhaps they didn't want to use paywalls any more for fear of driving away viewers. I'm not completely sure.
  - I did talk to a number of potential musician users while building this, and they were enthusiastic... but they didn't end up using it. A good reminder that it's what users _do_, not what they _say_, that matters. I should have had them use the actual product more and analyzed their real behavior before building any further.

--- 

## Parting thoughts

To be completely honest, I thought building GigWindow would be a huge savior for the indie music community, it would turn into a thriving open source project, and I would be earning a solid living. 

None of those came true. But despite a few regrets about the "terrible decisions", it was a project well worth doing. I learned a ton and it kept me sane during lockdown. 

If you want to start your own GigWindow instance, please go right ahead. The only requirement is that the code continues being open source and freely available to anyone who is interested. 

You can reach me at dan [at] dangurney [dot] net