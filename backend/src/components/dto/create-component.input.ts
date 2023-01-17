import { Field, Float, InputType } from '@nestjs/graphql';
import { ObjectTypes } from '../entities/component.entity';

@InputType()
export class CreateComponentInput {
  @Field()
  name: string;

  @Field(() => ObjectTypes, { nullable: true })
  objectType?: ObjectTypes;

  @Field()
  manufacturer: string;

  @Field(() => Float)
  price: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  modelUrl?: string;

  @Field({ defaultValue: true })
  active: boolean;
}
