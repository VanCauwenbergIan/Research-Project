import { Field, Float, InputType } from '@nestjs/graphql';
import { ObjectTypes } from '../entities/component.entity';
import { Vector3 } from '../entities/vector3.entity';

@InputType()
export class CreateComponentInput {
  @Field()
  name: string;

  @Field(() => ObjectTypes, { nullable: true })
  objectType?: ObjectTypes;

  @Field()
  manufacturer: string;

  @Field(() => Float)
  price: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  modelUrl?: string;

  @Field(() => Vector3, { defaultValue: { x: 1, y: 1, z: 1 } })
  scale: Vector3;

  @Field(() => Vector3, { defaultValue: { x: 0, y: 0, z: 0 } })
  rotation: Vector3;

  @Field({ defaultValue: true })
  active: boolean;
}
