import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { SocketTypes } from '../entities/component.entity';
import { CreateComponentInput } from './create-component.input';

@InputType()
export class CreateCPUInput extends CreateComponentInput {
  @Field()
  series: string;

  @Field()
  integratedGraphics: boolean;

  @Field(() => SocketTypes)
  socket: SocketTypes;

  @Field(() => Int)
  coreCount: number;

  @Field(() => Int)
  threadCount: number;

  @Field(() => Float)
  clockSpeed: number;

  @Field(() => Float)
  cacheSize: number;

  @Field(() => Int)
  tdp: number;
}
