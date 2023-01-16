import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateComponentInput } from './create-component.input';

@InputType()
export class CreatePSUInput extends CreateComponentInput {
  @Field(() => Int)
  power: number;

  @Field(() => Int)
  rating: number;

  @Field()
  modular: boolean;
}
