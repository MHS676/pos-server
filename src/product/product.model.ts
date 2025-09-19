import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Category } from '../category/category.model';

@ObjectType()
export class Product {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field(() => Float)
    price: number;

    @Field(() => Int)
    stock: number;

    @Field(() => Int)
    categoryId: number;

    @Field(() => Int)
    organizationId: number;

    @Field(() => Category, { nullable: true })
    category?: Category;
}
