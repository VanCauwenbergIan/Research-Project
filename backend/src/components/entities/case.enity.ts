import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { BoundingBox } from './boundingbox.entity';
import { Component } from './component.entity';
import { MoboTypes } from './motherboard.entity';

@ObjectType()
export class Clase extends Component {
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
