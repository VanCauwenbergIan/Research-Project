import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { ObjectIdColumn, Column, Entity } from 'typeorm';
import { ObjectId } from 'mongodb';

@ObjectType()
export class Component {
  @Field(() => ID)
  @ObjectIdColumn({ name: '_id' })
  id: ObjectId;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  manufacturer: string;

  @Field(() => Float)
  @Column()
  price: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;

  @Field()
  @Field({ defaultValue: true })
  active: boolean;
}
