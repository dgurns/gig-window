import { Resolver, Mutation } from 'type-graphql';
import LiveVideoInfrastructure from 'services/LiveVideoInfrastructure';

@Resolver()
export class AdminResolver {
  @Mutation(() => Boolean)
  async deleteStaleResources() {
    await LiveVideoInfrastructure.deleteStaleResources();
    return true;
  }
}
