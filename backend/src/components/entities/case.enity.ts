import {
  createUnionType,
  Field,
  Float,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { Column } from 'typeorm';
import { BoundingBox } from './boundingbox.entity';
import { Component } from './component.entity';
import { MoboTypes } from './motherboard.entity';
// import { Cooler } from './cooler.entity';
// import { CPU } from './cpu.entity';
// import { CPUCooler } from './cpucooler.entity';
// import { GPU } from './gpu.entity';
// import { Memory } from './memory.entity';
// import { MoboTypes, Motherboard } from './motherboard.entity';
// import { PSU } from './psu.entity';

@ObjectType()
export class Case extends Component {
  @Field(() => [MoboTypes])
  @Column()
  supportedMotherboardFormats: [MoboTypes];

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
  drivesBB: [BoundingBox];

  @Field(() => [BoundingBox])
  @Column()
  fansBB: [BoundingBox];

  // todo: add a way to check cpu cooler size
}
