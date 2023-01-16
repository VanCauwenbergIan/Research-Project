import {
  Resolver,
  Query,
  Mutation,
  Args,
  createUnionType,
} from '@nestjs/graphql';
import {
  ClientMessage,
  ComponentOutputUnion,
} from 'src/bootstrap/entities/clientMessage';
import { ComponentsService } from './components.service';
import { CreateDynamicInput } from './dto/create-dynamic.input';
import { UpdateDynamicInput } from './dto/update-dynamic.input';
import { Component } from './entities/component.entity';
import { Cooler } from './entities/cooler.entity';

@Resolver(() => ComponentOutputUnion)
export class ComponentsResolver {
  constructor(private readonly componentsService: ComponentsService) {}

  @Mutation(() => ComponentOutputUnion)
  createComponent(
    @Args('createComponentInput')
    createComponentInput: CreateDynamicInput,
  ): typeof ComponentOutputUnion {
    // return this.componentsService.create(createComponentInput);
    const test = new Cooler();
    test.diameter = 1;
    return test;
  }

  @Query(() => [ComponentOutputUnion], { name: 'components' })
  findAll(): Array<typeof ComponentOutputUnion> {
    // return this.componentsService.findAll();
    const test = new Cooler();
    test.diameter = 1;
    return [test];
  }

  @Query(() => ComponentOutputUnion, { name: 'component' })
  findOne(
    @Args('id', { type: () => String }) id: string,
  ): typeof ComponentOutputUnion {
    // return this.componentsService.findOne(id);
    const test = new Cooler();
    test.diameter = 1;
    return test;
  }

  @Mutation(() => ComponentOutputUnion)
  updateComponent(
    @Args('updateComponentInput')
    updateComponentInput: UpdateDynamicInput,
  ): typeof ComponentOutputUnion {
    // return this.componentsService.update(
    //   updateComponentInput.id,
    //   updateComponentInput,
    // );
    const test = new Cooler();
    test.diameter = 1;
    return test
  }

  @Mutation(() => ComponentOutputUnion)
  removeComponent(@Args('id', { type: () => String }) id: string): typeof ComponentOutputUnion  {
    // return this.componentsService.remove(id);
    const test = new Cooler();
    test.diameter = 1;
    return test;
  }
}
