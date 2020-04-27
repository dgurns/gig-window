import { Resolver, Mutation } from 'type-graphql';
import LiveVideoInfrastructure from 'services/LiveVideoInfrastructure';

@Resolver()
export class AdminResolver {
  @Mutation(() => String)
  async deleteStaleResources() {
    const numberOfResourcesDeleted = await LiveVideoInfrastructure.deleteStaleResources();
    return `Deleted ${numberOfResourcesDeleted} resources`;
  }
}
