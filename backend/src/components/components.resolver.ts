import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ComponentsService } from './components.service';
import { Component } from './entities/component.entity';
import { CreateComponentInput } from './dto/create-component.input';
import { UpdateComponentInput } from './dto/update-component.input';

@Resolver(() => Component)
export class ComponentsResolver {
  constructor(private readonly componentsService: ComponentsService) {}

  @Mutation(() => Component)
  createComponent(@Args('createComponentInput') createComponentInput: CreateComponentInput) {
    return this.componentsService.create(createComponentInput);
  }

  @Query(() => [Component], { name: 'components' })
  findAll() {
    return this.componentsService.findAll();
  }

  @Query(() => Component, { name: 'component' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.componentsService.findOne(id);
  }

  @Mutation(() => Component)
  updateComponent(@Args('updateComponentInput') updateComponentInput: UpdateComponentInput) {
    return this.componentsService.update(updateComponentInput.id, updateComponentInput);
  }

  @Mutation(() => Component)
  removeComponent(@Args('id', { type: () => String }) id: string) {
    return this.componentsService.remove(id);
  }
}
