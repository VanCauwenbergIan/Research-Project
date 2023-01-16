import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateCoolerInput } from './create-cooler.input';

@InputType()
export class UpdateCoolerInput extends PartialType(CreateCoolerInput) {
  @Field()
  id: string;
}
