import {
  Resolver,
  Query,
  Mutation,
  Args,
  createUnionType,
} from '@nestjs/graphql';
import { ClientMessage } from 'src/bootstrap/entities/clientMessage';
import { ComponentsService } from './components.service';
import { CreateDynamicInput } from './dto/create-dynamic.input';
import { UpdateDynamicInput } from './dto/update-dynamic.input';
import {
  Case,
  ComponentOutputUnion,
  Cooler,
  CPU,
  CPUCooler,
  GPU,
  Memory,
  Motherboard,
  PSU,
  Storage,
} from './entities/component.entity';

@Resolver()
export class ComponentsResolver {
  constructor(private readonly componentsService: ComponentsService) {}

  @Mutation(() => ComponentOutputUnion)
  createComponent(
    @Args('createComponentInput')
    createComponentInput: CreateDynamicInput,
  ): Promise<typeof ComponentOutputUnion> {
    return this.componentsService.resolveCreation(createComponentInput);
  }

  @Mutation(() => ComponentOutputUnion)
  updateComponent(
    @Args('updateComponentInput')
    updateComponentInput: UpdateDynamicInput,
  ): Promise<typeof ComponentOutputUnion> {
    return this.componentsService.resolveUpdate(updateComponentInput);
  }

  @Query(() => [ComponentOutputUnion], { name: 'components' })
  async findAll(): Promise<Array<typeof ComponentOutputUnion>> {
    const cases = await this.componentsService.findAllCases();
    const coolers = await this.componentsService.findAllCoolers();
    const cpus = await this.componentsService.findAllCpus();
    const cpuCoolers = await this.componentsService.findAllCpuCoolers();
    const gpus = await this.componentsService.findAllGpus();
    const memmory = await this.componentsService.findAllMemory();
    const motherboards = await this.componentsService.findAllMotherboards();
    const psus = await this.componentsService.findAllPsus();
    const storage = await this.componentsService.findAllStorage();

    const result = [
      ...cases,
      ...coolers,
      ...cpus,
      ...cpuCoolers,
      ...gpus,
      ...memmory,
      ...motherboards,
      ...psus,
      ...storage,
    ];

    return result;
  }

  @Query(() => [Case], { name: 'cases' })
  findAllCases(): Promise<Case[]> {
    return this.componentsService.findAllCases();
  }

  @Query(() => [Cooler], { name: 'coolers' })
  findAllCoolers(): Promise<Cooler[]> {
    return this.componentsService.findAllCoolers();
  }

  @Query(() => [CPU], { name: 'cpus' })
  findAllCPUs(): Promise<CPU[]> {
    return this.componentsService.findAllCpus();
  }

  @Query(() => [CPUCooler], { name: 'cpucoolers' })
  findAllCPUCoolers(): Promise<CPUCooler[]> {
    return this.componentsService.findAllCpuCoolers();
  }

  @Query(() => [GPU], { name: 'gpus' })
  findAllGPUs(): Promise<GPU[]> {
    return this.componentsService.findAllGpus();
  }

  @Query(() => [Memory], { name: 'memory' })
  findAllMemory(): Promise<Memory[]> {
    return this.componentsService.findAllMemory();
  }

  @Query(() => [Motherboard], { name: 'motherboards' })
  findAllMotherboards(): Promise<Motherboard[]> {
    return this.componentsService.findAllMotherboards();
  }

  @Query(() => [PSU], { name: 'psus' })
  findAllPSUs(): Promise<PSU[]> {
    return this.componentsService.findAllPsus();
  }

  @Query(() => [Storage], { name: 'storage' })
  findAllStorage(): Promise<Storage[]> {
    return this.componentsService.findAllStorage();
  }
}
