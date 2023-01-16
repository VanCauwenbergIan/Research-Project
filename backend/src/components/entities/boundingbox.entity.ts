import { Field, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { Vector3 } from './vector3.entity';

@ObjectType()
export class BoundingBox {
  @Field()
  @Column()
  position: Vector3;

  @Field()
  @Column()
  scale: Vector3;
}
