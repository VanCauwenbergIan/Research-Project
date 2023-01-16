import { Field, InputType } from '@nestjs/graphql';
import { SocketTypes } from '../entities/motherboard.entity';
import { CreateComponentInput } from './create-component.input';
import { CreateCoolerInput } from './create-cooler.input';

@InputType()
export class CreateCPUCoolerInput extends CreateCoolerInput {
  @Field(() => [SocketTypes])
  socket: SocketTypes[];
}
