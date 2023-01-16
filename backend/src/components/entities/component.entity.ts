import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Component {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
