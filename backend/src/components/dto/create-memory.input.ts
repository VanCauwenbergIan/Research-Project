import { Field, InputType, Int } from '@nestjs/graphql';
import { MemoryTypes } from '../entities/component.entity';
import { CreateComponentInput } from './create-component.input';

@InputType()
export class CreateMemoryInput extends CreateComponentInput {
  @Field(() => MemoryTypes)
  generation: MemoryTypes;

  @Field(() => Int)
  size: number;

  @Field()
  timings: string;
}
