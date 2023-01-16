import { createUnionType, Field, Int, ObjectType } from '@nestjs/graphql';
import { Case } from 'src/components/entities/case.enity';
import { Cooler } from 'src/components/entities/cooler.entity';
import { CPU } from 'src/components/entities/cpu.entity';
import { CPUCooler } from 'src/components/entities/cpucooler.entity';
import { GPU } from 'src/components/entities/gpu.entity';
import { Memory } from 'src/components/entities/memory.entity';
import { Motherboard } from 'src/components/entities/motherboard.entity';
import { PSU } from 'src/components/entities/psu.entity';
import { Storage } from 'src/components/entities/storage.entity';

export enum MessageTypes {
  success = 'success',
  error = 'error',
  warning = 'warning',
}

export const ComponentOutputUnion = createUnionType({
  name: 'ComponentOutputUnion',
  types: () =>
    [
      Case,
      Cooler,
      CPU,
      CPUCooler,
      GPU,
      Memory,
      Motherboard,
      PSU,
      Storage,
    ] as const,
  resolveType: (value) => {
    if (value.supportedMotherboardFormats) {
      // const { Case } = await import('./entities/case.enity');
      return Case;
    }
    if (value.diameter && value.socket) {
      // const { CPUCooler } = await import('./entities/cpucooler.entity');
      return CPUCooler;
    }
    if (value.diameter) {
      // const { Cooler } = await import('./entities/cooler.entity');
      return Cooler;
    }
    if (value.integratedGraphics) {
      // const { CPU } = await import('./entities/cpu.entity');
      return CPU;
    }
    if (value.vramSize) {
      // const { GPU } = await import('./entities/gpu.entity');
      return GPU;
    }
    if (value.timings) {
      // const { Memory } = await import('./entities/memory.entity');
      return Memory;
    }
    if (value.chipset) {
      // const { Motherboard } = await import('./entities/motherboard.entity');
      return Motherboard;
    }
    if (value.power) {
      // const { PSU } = await import('./entities/psu.entity');
      return PSU;
    }
    if (value.read) {
      // const { Storage } = await import('./entities/storage.entity');
      return Storage;
    }
    return null;
  },
});

@ObjectType()
export class ClientMessage {
  @Field()
  type: MessageTypes;

  @Field(() => ComponentOutputUnion, { nullable: true })
  data: typeof ComponentOutputUnion | null;

  @Field({ nullable: true })
  error?: string;

  @Field(() => Int)
  statusCode: number;
}
