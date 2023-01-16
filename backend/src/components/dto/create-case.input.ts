import { Field, InputType, Float, Int } from '@nestjs/graphql';
import { BoundingBox } from '../entities/boundingbox.entity';
import { MoboTypes } from '../entities/motherboard.entity';
import { CreateComponentInput } from './create-component.input';

@InputType()
export class CreateCaseInput extends CreateComponentInput {
  @Field(() => [MoboTypes])
  supportedMotherboardFormats: [MoboTypes];

  @Field(() => Float)
  maxLengthGPU: number;

  @Field(() => Int)
  pciSlots: number;

  @Field(() => BoundingBox)
  psuBB: BoundingBox;

  @Field(() => BoundingBox)
  motherboardBB: BoundingBox;

  @Field(() => [BoundingBox])
  drivesBB: [BoundingBox];

  @Field(() => [BoundingBox])
  fansBB: [BoundingBox];
}
