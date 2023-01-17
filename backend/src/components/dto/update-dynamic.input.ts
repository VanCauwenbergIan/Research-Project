import { Field, InputType } from '@nestjs/graphql';
import { ObjectTypes } from '../entities/component.entity';
import { UpdateCaseInput } from './update-case.input';
import { UpdateCoolerInput } from './update-cooler.input';
import { UpdateCPUInput } from './update-cpu.input';
import { UpdateCPUCoolerInput } from './update-cpucooler.input';
import { UpdateGPUInput } from './update-gpu.input';
import { UpdateMemoryInput } from './update-memory.input';
import { UpdateMotherboardInput } from './update-motherboard.input';
import { UpdatePSUInput } from './update-psu.input';
import { UpdateStorageInput } from './update-storage.input';

@InputType()
export class UpdateDynamicInput {
  @Field(() => ObjectTypes)
  type: ObjectTypes;

  @Field(() => UpdateCaseInput, { nullable: true })
  caseInput?: UpdateCaseInput;

  @Field(() => UpdateCoolerInput, { nullable: true })
  coolerInput?: UpdateCoolerInput;

  @Field(() => UpdateCPUInput, { nullable: true })
  cpuInput?: UpdateCPUInput;

  @Field(() => UpdateCPUCoolerInput, { nullable: true })
  cpuCoolerInput?: UpdateCPUCoolerInput;

  @Field(() => UpdateGPUInput, { nullable: true })
  gpuInput?: UpdateGPUInput;

  @Field(() => UpdateMemoryInput, { nullable: true })
  memoryInput?: UpdateMemoryInput;

  @Field(() => UpdateMotherboardInput, { nullable: true })
  motherboardInput?: UpdateMotherboardInput;

  @Field(() => UpdatePSUInput, { nullable: true })
  psuInput?: UpdatePSUInput;

  @Field(() => UpdateStorageInput, { nullable: true })
  storageInput?: UpdateStorageInput;
}
