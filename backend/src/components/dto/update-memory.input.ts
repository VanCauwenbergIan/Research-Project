import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateMemoryInput } from './create-memory.input';

@InputType()
export class UpdateMemoryInput extends PartialType(CreateMemoryInput) {
  @Field()
  id: string;
}
