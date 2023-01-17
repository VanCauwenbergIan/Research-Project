import {Field, Int, ObjectType } from '@nestjs/graphql';
import { ComponentOutputUnion } from 'src/components/entities/component.entity';

export enum MessageTypes {
  success = 'success',
  error = 'error',
  warning = 'warning',
}

@ObjectType()
export class ClientMessage {
  @Field()
  type: MessageTypes;

  @Field(() => ComponentOutputUnion, { nullable: true })
  data: typeof ComponentOutputUnion | null;

  @Field({ nullable: true })
  error?: string;

  @Field(() => Int)
  statusCode: number;
}
