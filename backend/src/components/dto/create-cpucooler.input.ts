import { Field, InputType, Int } from '@nestjs/graphql';
import { SocketTypes } from '../entities/component.entity';
import { CreateComponentInput } from './create-component.input';
import { CreateCoolerInput } from './create-cooler.input';

@InputType()
export class CreateCPUCoolerInput extends CreateCoolerInput {
  @Field(() => [SocketTypes])
  supportedSockets: SocketTypes[];

  @Field(() => Int)
  tdp: number;
}
