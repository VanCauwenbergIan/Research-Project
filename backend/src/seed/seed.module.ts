import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Case,
  Component,
  Cooler,
  CPU,
  CPUCooler,
  GPU,
  Memory,
  Motherboard,
  PSU,
  Storage,
} from 'src/components/entities/component.entity';
import { CommandModule } from 'nestjs-command';
import { DatabaseSeedCommand } from './seed.command';
import { DatabaseSeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Component,
      Case,
      Cooler,
      CPU,
      CPUCooler,
      GPU,
      Memory,
      Motherboard,
      PSU,
      Storage,
    ]),
    CommandModule,
  ],
  providers: [DatabaseSeedCommand, DatabaseSeedService],
})
export class DatabaseSeedModule {}
