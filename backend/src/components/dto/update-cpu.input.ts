import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateCPUInput } from './create-cpu.input';

@InputType()
export class UpdateCPUInput extends PartialType(CreateCPUInput) {
  @Field()
  id: string;
}
