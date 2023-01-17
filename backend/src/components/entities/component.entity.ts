import {
  ObjectType,
  Field,
  ID,
  Float,
  registerEnumType,
  Int,
  createUnionType,
} from '@nestjs/graphql';
import { ObjectIdColumn, Column, Entity } from 'typeorm';
import { ObjectId } from 'mongodb';
import { BoundingBox } from './boundingbox.entity';

export enum ObjectTypes {
  case = 'PC Case',
  cooler = 'Case Cooler',
  cpu = 'CPU',
  cpu_cooler = 'CPU Cooler',
  gpu = 'GPU',
  memory = 'Memory Module',
  motherboard = 'Motherboard',
  psu = 'PSU',
  storage = 'Storage Device',
}
export enum VramTypes {
  gddr5 = 'GDDR5',
  gddr6 = 'GDDR5',
}
export enum MemoryTypes {
  ddr3 = 'DDR3',
  ddr4 = 'DDR4',
  ddr5 = 'DDR3',
}
export enum MoboTypes {
  itx = 'Mini-ITX',
  m_atx = 'Micro-ATX',
  atx = 'ATX',
  e_atx = 'E-ATX',
}
export enum SocketTypes {
  lga1151 = 'LGA 1151',
  lga2066 = 'LGA 2066',
  lga1200 = 'LGA 1200',
  lga1700 = 'LGA 1700',
  am4 = 'AM4',
  am5 = 'AM5',
}
export enum StorageTypes {
  ssd = 'SSD',
  hdd = 'HDD',
}

export enum StorageFormats {
  sata = 'SATA',
  pcie = 'PCIe',
  m2 = 'M2',
}

registerEnumType(ObjectTypes, {
  name: 'ObjectTypes',
});
registerEnumType(VramTypes, {
  name: 'VramTypes',
});
registerEnumType(MemoryTypes, {
  name: 'MemoryTypes',
});
registerEnumType(MoboTypes, {
  name: 'MoboTypes',
});
registerEnumType(SocketTypes, {
  name: 'SocketTypes',
});
registerEnumType(StorageTypes, {
  name: 'StorageTypes',
});
registerEnumType(StorageFormats, {
  name: 'StorageFormats',
});

@Entity()
@ObjectType()
export class Component {
  @Field(() => ID)
  @ObjectIdColumn({ name: '_id' })
  id: ObjectId;

  @Field()
  @Column()
  name: string;

  @Field(() => ObjectTypes)
  @Column()
  objectType: ObjectTypes;

  @Field()
  @Column()
  manufacturer: string;

  @Field(() => Float)
  @Column()
  price: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  modelUrl?: string;

  @Field({ defaultValue: true })
  @Column()
  active: boolean;
}

@Entity()
@ObjectType()
export class Case extends Component {
  @Field(() => [MoboTypes])
  @Column()
  supportedMotherboardFormats: MoboTypes[];

  @Field(() => Float)
  @Column()
  maxLengthGPU: number;

  @Field(() => Int)
  @Column()
  pciSlots: number;

  @Field(() => BoundingBox)
  @Column()
  psuBB: BoundingBox;

  @Field(() => BoundingBox)
  @Column()
  motherboardBB: BoundingBox;

  @Field(() => [BoundingBox])
  @Column()
  drivesBB: BoundingBox[];

  @Field(() => [BoundingBox])
  @Column()
  fansBB: BoundingBox[];

  // todo: add a way to check cpu cooler size
}

@Entity()
@ObjectType()
export class Cooler extends Component {
  @Field(() => Int)
  @Column()
  diameter: number;

  @Field(() => Float)
  @Column()
  noise: number;
}

@Entity()
@ObjectType()
export class CPU extends Component {
  @Field()
  @Column()
  series: string;

  @Field()
  @Column()
  integratedGraphics: boolean;

  @Field(() => SocketTypes)
  @Column()
  socket: SocketTypes;

  @Field(() => Int)
  @Column()
  coreCount: number;

  @Field(() => Int)
  @Column()
  threadCount: number;

  @Field(() => Float)
  @Column()
  clockSpeed: number;

  @Field(() => Float)
  @Column()
  cacheSize: number;

  @Field(() => Int)
  @Column()
  tdp: number;
}

@Entity()
@ObjectType()
export class CPUCooler extends Cooler {
  @Field(() => [SocketTypes])
  @Column()
  socket: SocketTypes[];

  @Field(() => Int)
  @Column()
  tdp: number;
}

@Entity()
@ObjectType()
export class GPU extends Component {
  @Field()
  @Column()
  series: string;

  @Field(() => Int)
  @Column()
  vramSize: number;

  @Field(() => VramTypes)
  @Column()
  vramType: VramTypes;

  @Field(() => Float)
  @Column()
  length: number;

  @Field(() => Int)
  @Column()
  tdp: number;

  @Field(() => Int)
  @Column()
  slots: number;

  @Field(() => Int)
  @Column()
  cores: number;

  @Field(() => Float)
  @Column()
  clockSpeed: number;
}

@Entity()
@ObjectType()
export class Memory extends Component {
  @Field(() => MemoryTypes)
  @Column()
  generation: MemoryTypes;

  @Field(() => Int)
  @Column()
  size: number;

  @Field()
  @Column()
  timings: string;
}

@Entity()
@ObjectType()
export class Motherboard extends Component {
  @Field(() => MoboTypes)
  @Column()
  format: MoboTypes;

  @Field(() => SocketTypes)
  @Column()
  socket: SocketTypes;

  @Field()
  @Column()
  chipset: string;

  @Field(() => [MemoryTypes])
  @Column()
  supportedMemoryTypes: MemoryTypes[];

  @Field(() => Int)
  @Column()
  memorySlots: number;

  @Field(() => Int)
  @Column()
  maxMemory: number;

  @Field(() => BoundingBox)
  @Column()
  cpuBB: BoundingBox;

  @Field(() => [BoundingBox])
  @Column()
  ramBB: BoundingBox[];

  // SLI and crossfire are basically dead anyway
  @Field(() => BoundingBox)
  @Column()
  gpuBB: BoundingBox;

  // it would be good to also add support for PCIe SSDs
}
@Entity()
@ObjectType()
export class PSU extends Component {
  @Field(() => Int)
  @Column()
  power: number;

  @Field(() => Int)
  @Column()
  rating: number;

  @Field()
  @Column()
  modular: boolean;
}

@Entity()
@ObjectType()
export class Storage extends Component {
  @Field(() => StorageTypes)
  @Column()
  type: StorageTypes;

  @Field(() => StorageFormats)
  @Column()
  format: StorageFormats;

  @Field(() => Int)
  @Column()
  capacity: number;

  @Field(() => Int)
  @Column()
  read: number;

  @Field(() => Int)
  @Column()
  write: number;
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
      return Case;
    } else if (value.diameter && value.socket) {
      return CPUCooler;
    } else if (value.diameter) {
      return Cooler;
    } else if (value.integratedGraphics) {
      return CPU;
    } else if (value.vramSize) {
      return GPU;
    } else if (value.timings) {
      return Memory;
    } else if (value.chipset) {
      return Motherboard;
    } else if (value.power) {
      return PSU;
    } else if (value.read) {
      return Storage;
    } else {
      return null;
    }
  },
});
