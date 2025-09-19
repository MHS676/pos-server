import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { Product } from './product.model';
import { CreateProductInput } from './dto/create-product.input';

@Resolver(() => Product)
export class ProductResolver {
    constructor(private productService: ProductService) { }

    @UseGuards(GqlAuthGuard)
    @Query(() => [Product], { description: 'List all products' })
    async products(@CurrentUser() user: any) {
        return this.productService.getProducts(user.organizationId);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Product, { description: 'Create a new product' })
    async createProduct(
        @Args('data') data: CreateProductInput,
        @CurrentUser() user: any,
    ) {
        return this.productService.createProduct({
            ...data,
            organizationId: user.organizationId,
        });
    }
}
