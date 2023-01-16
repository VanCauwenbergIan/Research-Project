import { Field, Int } from '@nestjs/graphql';
import { Component } from './component.entity';
import { Column } from 'typeorm';

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
