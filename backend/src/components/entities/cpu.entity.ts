import { Field, Float, Int } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { Component } from './component.entity';
import { SocketTypes } from './motherboard.entity';

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
