import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateCaseInput } from './create-case.input';

@InputType()
export class UpdateCaseInput extends PartialType(CreateCaseInput) {
  @Field()
  id: string;
}
