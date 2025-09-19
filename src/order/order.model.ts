import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';

@ObjectType()
export class Order {
    @Field(() => Int)
    id: number;

    @Field(() => Int)
    userId: number;

    @Field(() => Int)
    productId: number;

    @Field(() => Int)
    quantity: number;

    @Field(() => Float)
    totalPrice: number;

    @Field()
    createdAt: Date;

    @Field(() => User, { nullable: true })
    user?: User;

    @Field(() => Product, { nullable: true })
    product?: Product;
}
