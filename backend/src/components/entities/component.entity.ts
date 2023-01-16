import {
  ObjectType,
  Field,
  ID,
  Float,
  registerEnumType,
} from '@nestjs/graphql';
import { ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

export enum ObjectTypes {
  case = 'PC Case',
  cooler = 'Case Cooler',
  cpu = 'CPU',
  cpu_cooler = 'CPU Cooler',
  gpu = 'GPU',
  memory = 'Memory',
  motherboard = 'Motherboard',
  psu = 'PSU',
  storage = 'Storage',
}

registerEnumType(ObjectTypes, {
  name: 'ObjectTypes',
});

@ObjectType()
export class Component {
  @Field(() => ID)
  @ObjectIdColumn({ name: '_id' })
  id: ObjectId;

  @Field()
  @Column()
  name: string;

  @Field(() => ObjectTypes)
  @Column()
  objectType: ObjectTypes;

  @Field()
  @Column()
  manufacturer: string;

  @Field(() => Float)
  @Column()
  price: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;

  @Field({ defaultValue: true })
  @Column()
  active: boolean;
}
