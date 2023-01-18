import { Field, InputType } from '@nestjs/graphql';
import { ObjectTypes } from '../entities/component.entity';
import { CreateCaseInput } from './create-case.input';
import { CreateCoolerInput } from './create-cooler.input';
import { CreateCPUInput } from './create-cpu.input';
import { CreateCPUCoolerInput } from './create-cpucooler.input';
import { CreateGPUInput } from './create-gpu.input';
import { CreateMemoryInput } from './create-memory.input';
import { CreateMotherboardInput } from './create-motherboard.input';
import { CreatePSUInput } from './create-psu.input';
import { CreateStorageInput } from './create-storage.input';

@InputType()
export class CreateDynamicInput {
  @Field(() => ObjectTypes)
  type: ObjectTypes;

  @Field(() => CreateCaseInput, { nullable: true })
  caseInput?: CreateCaseInput;

  @Field(() => CreateCoolerInput, { nullable: true })
  coolerInput?: CreateCoolerInput;

  @Field(() => CreateCPUInput, { nullable: true })
  cpuInput?: CreateCPUInput;

  @Field(() => CreateCPUCoolerInput, { nullable: true })
  cpuCoolerInput?: CreateCPUCoolerInput;

  @Field(() => CreateGPUInput, { nullable: true })
  gpuInput?: CreateGPUInput;

  @Field(() => CreateMemoryInput, { nullable: true })
  memoryInput?: CreateMemoryInput;

  @Field(() => CreateMotherboardInput, { nullable: true })
  motherboardInput?: CreateMotherboardInput;

  @Field(() => CreatePSUInput, { nullable: true })
  psuInput?: CreatePSUInput;

  @Field(() => CreateStorageInput, { nullable: true })
  storageInput?: CreateStorageInput;
}
