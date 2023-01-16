import { Module } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { ComponentsResolver } from './components.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from './entities/component.entity';
import { Case } from './entities/case.enity';
import { Cooler } from './entities/cooler.entity';
import { CPU } from './entities/cpu.entity';
import { CPUCooler } from './entities/cpucooler.entity';
import { GPU } from './entities/gpu.entity';
import { Memory } from './entities/memory.entity';
import { Motherboard } from './entities/motherboard.entity';
import { PSU } from './entities/psu.entity';
import { Storage } from './entities/storage.entity';

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
