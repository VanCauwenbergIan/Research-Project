import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { CreateComponentInput } from './create-component.input';

@InputType()
export class CreateCoolerInput extends CreateComponentInput {
  @Field(() => Float)
  diameter: number;

  @Field(() => Float)
  noise: number;
}
