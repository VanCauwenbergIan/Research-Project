import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateComponentInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
