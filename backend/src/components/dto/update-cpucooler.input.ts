import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateCPUCoolerInput } from './create-cpucooler.input';

@InputType()
export class UpdateCPUCoolerInput extends PartialType(CreateCPUCoolerInput) {
  @Field()
  id: string;
}
