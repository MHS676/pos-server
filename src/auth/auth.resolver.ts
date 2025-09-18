import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../user/user.model';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    @Mutation(() => User)
    async register(
        @Args('email') email: string,
        @Args('password') password: string,
        @Args('name') name: string,
        @Args('organizationId', { type: () => Int }) organizationId: number,
    ) {
        return this.authService.register(email, password, name, organizationId);
    }

    @Mutation(() => String)
    async login(
        @Args('email') email: string,
        @Args('password') password: string,
    ) {
        return this.authService.login(email, password);
    }
}
