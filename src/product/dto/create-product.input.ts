import { Field, Float, Int, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
    @Field()
    name: string;

    @Field(() => Float)
    price: number;

    @Field(() => Int)
    stock: number;

    @Field(() => Int)
    categoryId: number;
}
