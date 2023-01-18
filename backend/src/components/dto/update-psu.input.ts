import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreatePSUInput } from './create-psu.input';

@InputType()
export class UpdatePSUInput extends PartialType(CreatePSUInput) {
  @Field()
  id: string;
}
