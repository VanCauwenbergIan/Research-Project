import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateCPUCoolerInput } from './create-cpucooler.input';

@InputType()
export class UpdateCPUCooler extends PartialType(CreateCPUCoolerInput) {
  @Field()
  id: string;
}
