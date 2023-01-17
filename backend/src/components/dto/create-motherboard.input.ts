import { Field, InputType, Int } from "@nestjs/graphql";
import { BoundingBox } from "../entities/boundingbox.entity";
import { MemoryTypes, MoboTypes, SocketTypes } from "../entities/component.entity";
import { CreateComponentInput } from "./create-component.input";

@InputType()
export class CreateMotherboardInput extends CreateComponentInput {
  @Field(() => MoboTypes)
  format: MoboTypes;

  @Field(() => SocketTypes)
  socket: SocketTypes;

  @Field()
  chipset: string;

  @Field(() => [MemoryTypes])
  supportedMemoryTypes: MemoryTypes[];

  @Field(() => Int)
  memorySlots: number;

  @Field(() => Int)
  maxMemory: number;

  @Field(() => BoundingBox)
  cpuBB: BoundingBox;

  @Field(() => [BoundingBox])
  ramBB: BoundingBox[];

  @Field(() => BoundingBox)
  gpuBB: BoundingBox;
}