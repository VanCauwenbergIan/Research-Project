import { Field, Float, Int } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { Component } from './component.entity';

export class Cooler extends Component {
  @Field(() => Int)
  @Column()
  diameter: number;

  @Field(() => Int)
  @Column()
  tdp: number;

  @Field(() => Float)
  @Column()
  noise: number;
}
