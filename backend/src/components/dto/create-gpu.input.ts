import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { VramTypes } from '../entities/component.entity';
import { CreateComponentInput } from './create-component.input';

@InputType()
export class CreateGPUInput extends CreateComponentInput {
  @Field()
  series: string;

  @Field(() => Int)
  vramSize: number;

  @Field(() => VramTypes)
  vramType: VramTypes;

  @Field(() => Float)
  length: number;

  @Field(() => Int)
  tdp: number;

  @Field(() => Int)
  slots: number;

  @Field(() => Int)
  cores: number;

  @Field(() => Float)
  clockSpeed: number;
}
