import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateGPUInput } from './create-gpu.input';

@InputType()
export class UpdateGPUInput extends PartialType(CreateGPUInput) {
  @Field()
  id: string;
}
