import { Field } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { Cooler } from './cooler.entity';
import { SocketTypes } from './motherboard.entity';

export class CPUCooler extends Cooler {
  @Field(() => [SocketTypes])
  @Column()
  socket: SocketTypes[];
}
