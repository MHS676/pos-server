import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { Order } from './order.model';

@Resolver(() => Order)
export class OrderResolver {
    constructor(private orderService: OrderService) { }

    @UseGuards(GqlAuthGuard)
    @Query(() => [Order], { description: 'List all orders for the organization' })
    async orders(@CurrentUser() user: any) {
        return this.orderService.getOrders(user.organizationId);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Order, { description: 'Place an order' })
    async placeOrder(
        @Args('productId', { type: () => Int }) productId: number,
        @Args('quantity', { type: () => Int }) quantity: number,
        @CurrentUser() user: any,
    ) {
        return this.orderService.placeOrder(user.userId, productId, quantity);
    }
}
