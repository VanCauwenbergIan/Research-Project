import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CreateComponentInput {
  @Field()
  name: string;

  @Field()
  manufacturer: string;

  @Field(() => Float)
  price: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ defaultValue: true })
  active: boolean;
}
