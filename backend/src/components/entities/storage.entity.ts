import { Field, Int } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { Component } from './component.entity';

enum StorageTypes {
  ssd = 'SSD',
  hdd = 'HDD',
}

enum StorageFormats {
  sata = 'SATA',
  pcie = 'PCIe',
  m2 = 'M2',
}

export class Storage extends Component {
  @Field(() => StorageTypes)
  @Column()
  type: StorageTypes;

  @Field(() => StorageFormats)
  @Column()
  format: StorageFormats;

  @Field(() => Int)
  @Column()
  capacity: number;

  @Field(() => Int)
  @Column()
  read: number;

  @Field(() => Int)
  @Column()
  write: number;
}
