import { Field, Float, Int } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { Component } from './component.entity';

enum VramTypes {
  gddr5 = 'GDDR5',
  gddr6 = 'GDDR5',
}

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

  @Field(() => Int)
  @Column()
  clockSpeed: number;
}
