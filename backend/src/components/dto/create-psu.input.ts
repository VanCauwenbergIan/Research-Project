import { Field, InputType, Int } from '@nestjs/graphql';
import { MoboTypes } from '../entities/component.entity';
import { CreateComponentInput } from './create-component.input';

@InputType()
export class CreatePSUInput extends CreateComponentInput {
  @Field(() => Int)
  power: number;

  @Field(() => MoboTypes)
  format: MoboTypes;

  @Field(() => Int)
  rating: number;

  @Field()
  modular: boolean;
}
