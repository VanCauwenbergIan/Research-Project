import { Module } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { ComponentsResolver } from './components.resolver';
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
} from './entities/component.entity';

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
  ],
  providers: [ComponentsResolver, ComponentsService],
})
export class ComponentsModule {}
