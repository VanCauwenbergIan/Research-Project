import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateMotherboardInput } from './create-motherboard.input';

@InputType()
export class UpdateMotherboardInput extends PartialType(
  CreateMotherboardInput,
) {
  @Field()
  id: string;
}
