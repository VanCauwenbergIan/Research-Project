import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateStorageInput } from './create-storage.input';

@InputType()
export class UpdateStorageInput extends PartialType(CreateStorageInput) {
  @Field()
  id: string;
}
