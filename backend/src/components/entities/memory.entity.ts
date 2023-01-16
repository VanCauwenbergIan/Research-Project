import { Field, Int, registerEnumType } from '@nestjs/graphql';
import { Column } from 'typeorm';

export enum MemoryTypes {
  ddr3 = 'DDR3',
  ddr4 = 'DDR4',
  ddr5 = 'DDR3',
}

registerEnumType(MemoryTypes, {
  name: 'MemoryTypes',
});

export class Memory {
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
