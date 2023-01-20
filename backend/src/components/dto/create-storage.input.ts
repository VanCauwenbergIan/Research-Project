import { Field, InputType, Int } from "@nestjs/graphql";
import { StorageFormats, StorageTypes } from "../entities/component.entity";
import { CreateComponentInput } from "./create-component.input";

@InputType()
export class CreateStorageInput extends CreateComponentInput {
  @Field(() => StorageTypes)
  type: StorageTypes;

  @Field(() => StorageFormats)
  formatConnection: StorageFormats;

  @Field(() => Int)
  capacity: number;

  @Field(() => Int)
  read: number;

  @Field(() => Int)
  write: number;
}