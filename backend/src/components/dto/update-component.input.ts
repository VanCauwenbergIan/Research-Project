import { CreateComponentInput } from './create-component.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateComponentInput extends PartialType(CreateComponentInput) {
  @Field()
  id: string;
}
