import { Field, Int, registerEnumType } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { BoundingBox } from './boundingbox.entity';
import { Component } from './component.entity';
import { MemoryTypes } from './memory.entity';

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

registerEnumType(MoboTypes, {
  name: 'MoboTypes',
});
registerEnumType(SocketTypes, {
  name: 'SocketTypes',
});

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
