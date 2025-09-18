import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from './user.model';

@Resolver(() => User)
export class UserResolver {
    constructor(private userService: UserService) { }

    @UseGuards(GqlAuthGuard)
    @Query(() => [User], { description: 'List all users in the same organization' })
    async users(@CurrentUser() user: any) {
        return this.userService.getUsers(user.organizationId);
    }
}
