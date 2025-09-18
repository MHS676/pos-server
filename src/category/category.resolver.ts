import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { Category } from './category.model';
import { CreateCategoryInput } from './dto/create-category.input';

@Resolver(() => Category)
export class CategoryResolver {
    constructor(private categoryService: CategoryService) { }

    @UseGuards(GqlAuthGuard)
    @Query(() => [Category], { description: 'List all categories for the organization' })
    async categories(@CurrentUser() user: any) {
        return this.categoryService.getCategories(user.organizationId);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Category, { description: 'Create a new category' })
    async createCategory(
        @Args('data') data: CreateCategoryInput,
        @CurrentUser() user: any,
    ) {
        return this.categoryService.createCategory(user.organizationId, data);
    }
}
