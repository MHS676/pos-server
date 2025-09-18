import { Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { CurrentUser } from '../../auth/current-user.decorator';
import { SyncService } from './sync.service';

@Resolver()
export class SyncResolver {
    constructor(private syncService: SyncService) { }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => String, { description: 'Sync users from JSONPlaceholder' })
    async syncUsers(@CurrentUser() user: any) {
        return this.syncService.syncUsers(user.organizationId);
    }

    // Make this guarded so we know which org to write to
    @UseGuards(GqlAuthGuard)
    @Mutation(() => String, { description: 'Sync categories from JSONPlaceholder' })
    async syncCategories(@CurrentUser() user: any) {
        return this.syncService.syncCategories(user.organizationId);
    }
}
