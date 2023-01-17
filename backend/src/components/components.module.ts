import { Module } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { ComponentsResolver } from './components.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from './entities/component.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Component]),
  ],
  providers: [ComponentsResolver, ComponentsService],
})
export class ComponentsModule {}
