import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType('Vector3Input')
@ObjectType()
export class Vector3 {
  @Field(() => Float)
  @Column()
  x: number;

  @Field(() => Float)
  @Column()
  y: number;

  @Field(() => Float)
  @Column()
  z: number;
}
