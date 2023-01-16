import { Field, Int, registerEnumType } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { Component } from './component.entity';

export enum MemoryTypes {
  ddr3 = 'DDR3',
  ddr4 = 'DDR4',
  ddr5 = 'DDR3',
}

registerEnumType(MemoryTypes, {
  name: 'MemoryTypes',
});

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
