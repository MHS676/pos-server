import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from '../product/product.model';

@ObjectType()
export class Category {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field()
    description: string;

    @Field(() => [Product], { nullable: 'itemsAndList' })
    products?: Product[];
}
