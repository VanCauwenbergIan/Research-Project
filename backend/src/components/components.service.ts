import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { Repository } from 'typeorm';
import { CreateCaseInput } from './dto/create-case.input';
import { CreateCoolerInput } from './dto/create-cooler.input';
import { CreateCPUInput } from './dto/create-cpu.input';
import { CreateCPUCoolerInput } from './dto/create-cpucooler.input';
import { CreateDynamicInput } from './dto/create-dynamic.input';
import { CreateGPUInput } from './dto/create-gpu.input';
import { CreateMemoryInput } from './dto/create-memory.input';
import { CreateMotherboardInput } from './dto/create-motherboard.input';
import { CreatePSUInput } from './dto/create-psu.input';
import { CreateStorageInput } from './dto/create-storage.input';
import { UpdateCaseInput } from './dto/update-case.input';
import { UpdateCoolerInput } from './dto/update-cooler.input';
import { UpdateCPUInput } from './dto/update-cpu.input';
import { UpdateCPUCoolerInput } from './dto/update-cpucooler.input';
import { UpdateDynamicInput } from './dto/update-dynamic.input';
import { UpdateGPUInput } from './dto/update-gpu.input';
import { UpdateMemoryInput } from './dto/update-memory.input';
import { UpdateMotherboardInput } from './dto/update-motherboard.input';
import { UpdatePSUInput } from './dto/update-psu.input';
import { UpdateStorageInput } from './dto/update-storage.input';
import {
  Case,
  ComponentOutputUnion,
  Cooler,
  CPU,
  CPUCooler,
  GPU,
  Memory,
  Motherboard,
  ObjectTypes,
  PSU,
  Storage,
} from './entities/component.entity';

@Injectable()
export class ComponentsService {
  constructor(
    @InjectRepository(Case)
    private readonly caseRepository: Repository<Case>,
    @InjectRepository(Cooler)
    private readonly coolerRepository: Repository<Cooler>,
    @InjectRepository(CPU)
    private readonly cpuRepository: Repository<CPU>,
    @InjectRepository(CPUCooler)
    private readonly cpuCoolerRepository: Repository<CPUCooler>,
    @InjectRepository(GPU)
    private readonly gpuRepository: Repository<GPU>,
    @InjectRepository(Memory)
    private readonly memoryRepository: Repository<Memory>,
    @InjectRepository(Motherboard)
    private readonly motherboardRepository: Repository<Motherboard>,
    @InjectRepository(PSU)
    private readonly psuRepository: Repository<PSU>,
    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
  ) {}
  // I would put them all one the same collection (a bit like STI for SQL databases), but I can't find a way to make this work for typeorm + mongodb and I already spent too long on this.

  createCase(createCaseInput: CreateCaseInput): Promise<Case> {
    console.log('This action adds a new Case');
    createCaseInput.objectType = ObjectTypes.case;

    return this.caseRepository.save(createCaseInput);
  }

  createCooler(createCoolerInput: CreateCoolerInput): Promise<Cooler> {
    console.log('This action adds a new Cooler');
    createCoolerInput.objectType = ObjectTypes.cooler;

    return this.coolerRepository.save(createCoolerInput);
  }

  createCpu(createCpuInput: CreateCPUInput): Promise<CPU> {
    console.log('This action adds a new CPU');
    createCpuInput.objectType = ObjectTypes.cpu;

    return this.cpuRepository.save(createCpuInput);
  }

  createCpuCooler(
    createCpuCoolerInput: CreateCPUCoolerInput,
  ): Promise<CPUCooler> {
    console.log('This action adds a new CPU Cooler');
    createCpuCoolerInput.objectType = ObjectTypes.cpu_cooler;

    return this.cpuCoolerRepository.save(createCpuCoolerInput);
  }

  createGpu(createGpuInput: CreateGPUInput): Promise<GPU> {
    console.log('This action adds a new GPU');
    createGpuInput.objectType = ObjectTypes.gpu;

    return this.gpuRepository.save(createGpuInput);
  }

  createMemory(createMemoryInput: CreateMemoryInput): Promise<Memory> {
    console.log('This action adds a new Memory Module');
    createMemoryInput.objectType = ObjectTypes.memory;

    return this.memoryRepository.save(createMemoryInput);
  }

  createMotherboard(
    createMotherboardInput: CreateMotherboardInput,
  ): Promise<Motherboard> {
    console.log('This action adds a new Motherboard');
    createMotherboardInput.objectType = ObjectTypes.motherboard;

    return this.motherboardRepository.save(createMotherboardInput);
  }

  createPsu(createPsuInput: CreatePSUInput): Promise<PSU> {
    console.log('This action adds a new PSU');
    createPsuInput.objectType = ObjectTypes.psu;

    return this.psuRepository.save(createPsuInput);
  }

  createStorage(createStorageInput: CreateStorageInput): Promise<Storage> {
    console.log('This action adds a new Storage Device');
    createStorageInput.objectType = ObjectTypes.storage;

    return this.storageRepository.save(createStorageInput);
  }

  async updateCase(updateCaseInput: UpdateCaseInput): Promise<Case> {
    console.log(`This updates Case ${updateCaseInput.id}`);
    const parsedId = new ObjectId(updateCaseInput.id);
    const caseObj = await this.caseRepository.findOneBy({
      //@ts-ignore
      _id: parsedId,
      active: true,
    });

    caseObj.name = updateCaseInput.name;
    caseObj.manufacturer = updateCaseInput.manufacturer;
    caseObj.price = updateCaseInput.price;
    caseObj.imageUrl = updateCaseInput.imageUrl;
    caseObj.modelUrl = updateCaseInput.modelUrl;
    caseObj.scale = updateCaseInput.scale;
    caseObj.rotation = updateCaseInput.rotation;
    caseObj.active = updateCaseInput.active;

    caseObj.supportedMotherboardFormats =
      updateCaseInput.supportedMotherboardFormats;
    caseObj.maxLengthGPU = updateCaseInput.maxLengthGPU;
    caseObj.pciSlots = updateCaseInput.pciSlots;
    caseObj.psuBB = updateCaseInput.psuBB;
    caseObj.motherboardBB = updateCaseInput.motherboardBB;
    caseObj.drivesBB = updateCaseInput.drivesBB;
    caseObj.fansBB = updateCaseInput.fansBB;

    return this.caseRepository.save(caseObj);
  }

  async updateCooler(updateCoolerInput: UpdateCoolerInput): Promise<Cooler> {
    console.log(`This updates Cooler ${updateCoolerInput.id}`);
    const parsedId = new ObjectId(updateCoolerInput.id);
    const coolerObj = await this.coolerRepository.findOneBy({
      //@ts-ignore
      _id: parsedId,
      active: true,
    });

    coolerObj.name = updateCoolerInput.name;
    coolerObj.manufacturer = updateCoolerInput.manufacturer;
    coolerObj.price = updateCoolerInput.price;
    coolerObj.imageUrl = updateCoolerInput.imageUrl;
    coolerObj.modelUrl = updateCoolerInput.modelUrl;
    coolerObj.scale = updateCoolerInput.scale;
    coolerObj.rotation = updateCoolerInput.rotation;
    coolerObj.active = updateCoolerInput.active;

    coolerObj.diameter = updateCoolerInput.diameter;
    coolerObj.noise = updateCoolerInput.noise;

    return this.coolerRepository.save(coolerObj);
  }

  async updateCpu(updateCpuInput: UpdateCPUInput): Promise<CPU> {
    console.log(`This updates CPU ${updateCpuInput.id}`);
    const parsedId = new ObjectId(updateCpuInput.id);
    const cpuObj = await this.cpuRepository.findOneBy({
      //@ts-ignore
      _id: parsedId,
      active: true,
    });

    cpuObj.name = updateCpuInput.name;
    cpuObj.manufacturer = updateCpuInput.manufacturer;
    cpuObj.price = updateCpuInput.price;
    cpuObj.imageUrl = updateCpuInput.imageUrl;
    cpuObj.modelUrl = updateCpuInput.modelUrl;
    cpuObj.scale = updateCpuInput.scale;
    cpuObj.rotation = updateCpuInput.rotation;
    cpuObj.active = updateCpuInput.active;

    cpuObj.series = updateCpuInput.series;
    cpuObj.integratedGraphics = updateCpuInput.integratedGraphics;
    cpuObj.socket = updateCpuInput.socket;
    cpuObj.coreCount = updateCpuInput.coreCount;
    cpuObj.threadCount = updateCpuInput.threadCount;
    cpuObj.clockSpeed = updateCpuInput.clockSpeed;
    cpuObj.cacheSize = updateCpuInput.cacheSize;
    cpuObj.tdp = updateCpuInput.tdp;
    cpuObj.coolerBB = updateCpuInput.coolerBB;

    return this.cpuRepository.save(cpuObj);
  }

  async updateCpuCooler(
    updateCpuCoolerInput: UpdateCPUCoolerInput,
  ): Promise<CPUCooler> {
    console.log(`This updates CPU Cooler ${updateCpuCoolerInput.id}`);
    const parsedId = new ObjectId(updateCpuCoolerInput.id);
    const cpuCoolerObj = await this.cpuCoolerRepository.findOneBy({
      //@ts-ignore
      _id: parsedId,
      active: true,
    });

    cpuCoolerObj.name = updateCpuCoolerInput.name;
    cpuCoolerObj.manufacturer = updateCpuCoolerInput.manufacturer;
    cpuCoolerObj.price = updateCpuCoolerInput.price;
    cpuCoolerObj.imageUrl = updateCpuCoolerInput.imageUrl;
    cpuCoolerObj.modelUrl = updateCpuCoolerInput.modelUrl;
    cpuCoolerObj.scale = updateCpuCoolerInput.scale;
    cpuCoolerObj.rotation = updateCpuCoolerInput.rotation;
    cpuCoolerObj.active = updateCpuCoolerInput.active;

    cpuCoolerObj.diameter = updateCpuCoolerInput.diameter;
    cpuCoolerObj.noise = updateCpuCoolerInput.noise;

    cpuCoolerObj.tdp = updateCpuCoolerInput.tdp;
    cpuCoolerObj.supportedSockets = updateCpuCoolerInput.supportedSockets;

    return this.cpuCoolerRepository.save(cpuCoolerObj);
  }

  async updateGpu(updateGpuInput: UpdateGPUInput): Promise<GPU> {
    console.log(`This updates GPU ${updateGpuInput.id}`);
    const parsedId = new ObjectId(updateGpuInput.id);
    const gpuObj = await this.gpuRepository.findOneBy({
      //@ts-ignore
      _id: parsedId,
      active: true,
    });

    gpuObj.name = updateGpuInput.name;
    gpuObj.manufacturer = updateGpuInput.manufacturer;
    gpuObj.price = updateGpuInput.price;
    gpuObj.imageUrl = updateGpuInput.imageUrl;
    gpuObj.modelUrl = updateGpuInput.modelUrl;
    gpuObj.scale = updateGpuInput.scale;
    gpuObj.rotation = updateGpuInput.rotation;
    gpuObj.active = updateGpuInput.active;

    gpuObj.series = updateGpuInput.series;
    gpuObj.vramSize = updateGpuInput.vramSize;
    gpuObj.vramType = updateGpuInput.vramType;
    gpuObj.length = updateGpuInput.length;
    gpuObj.tdp = updateGpuInput.tdp;
    gpuObj.slots = updateGpuInput.slots;
    gpuObj.cores = updateGpuInput.cores;
    gpuObj.clockSpeed = updateGpuInput.clockSpeed;

    return this.gpuRepository.save(gpuObj);
  }

  async updateMemory(updateMemoryInput: UpdateMemoryInput): Promise<Memory> {
    console.log(`This updates Memory Module ${updateMemoryInput.id}`);
    const parsedId = new ObjectId(updateMemoryInput.id);
    const memoryObj = await this.memoryRepository.findOneBy({
      //@ts-ignore
      _id: parsedId,
      active: true,
    });

    memoryObj.name = updateMemoryInput.name;
    memoryObj.manufacturer = updateMemoryInput.manufacturer;
    memoryObj.price = updateMemoryInput.price;
    memoryObj.imageUrl = updateMemoryInput.imageUrl;
    memoryObj.modelUrl = updateMemoryInput.modelUrl;
    memoryObj.scale = updateMemoryInput.scale;
    memoryObj.rotation = updateMemoryInput.rotation;
    memoryObj.active = updateMemoryInput.active;

    memoryObj.generation = updateMemoryInput.generation;
    memoryObj.size = updateMemoryInput.size;
    memoryObj.speed = updateMemoryInput.speed;

    return this.memoryRepository.save(memoryObj);
  }

  async updateMotherboard(
    updateMotherboardInput: UpdateMotherboardInput,
  ): Promise<Motherboard> {
    console.log(`This updates Motherboard ${updateMotherboardInput.id}`);
    const parsedId = new ObjectId(updateMotherboardInput.id);
    const motherboardObj = await this.motherboardRepository.findOneBy({
      //@ts-ignore
      _id: parsedId,
      active: true,
    });

    motherboardObj.name = updateMotherboardInput.name;
    motherboardObj.manufacturer = updateMotherboardInput.manufacturer;
    motherboardObj.price = updateMotherboardInput.price;
    motherboardObj.imageUrl = updateMotherboardInput.imageUrl;
    motherboardObj.modelUrl = updateMotherboardInput.modelUrl;
    motherboardObj.scale = updateMotherboardInput.scale;
    motherboardObj.rotation = updateMotherboardInput.rotation;
    motherboardObj.active = updateMotherboardInput.active;

    motherboardObj.format = updateMotherboardInput.format;
    motherboardObj.socket = updateMotherboardInput.socket;
    motherboardObj.chipset = updateMotherboardInput.chipset;
    motherboardObj.supportedMemoryTypes =
      updateMotherboardInput.supportedMemoryTypes;
    motherboardObj.memorySlots = updateMotherboardInput.memorySlots;
    motherboardObj.maxMemory = updateMotherboardInput.maxMemory;
    motherboardObj.cpuBB = updateMotherboardInput.cpuBB;
    motherboardObj.ramBB = updateMotherboardInput.ramBB;
    motherboardObj.gpuBB = updateMotherboardInput.gpuBB;

    return this.motherboardRepository.save(motherboardObj);
  }

  async updatePsu(updatePsuInput: UpdatePSUInput): Promise<PSU> {
    console.log(`This updates PSU ${updatePsuInput.id}`);
    const parsedId = new ObjectId(updatePsuInput.id);
    const psuObj = await this.psuRepository.findOneBy({
      //@ts-ignore
      _id: parsedId,
      active: true,
    });

    psuObj.name = updatePsuInput.name;
    psuObj.manufacturer = updatePsuInput.manufacturer;
    psuObj.price = updatePsuInput.price;
    psuObj.imageUrl = updatePsuInput.imageUrl;
    psuObj.modelUrl = updatePsuInput.modelUrl;
    psuObj.scale = updatePsuInput.scale;
    psuObj.rotation = updatePsuInput.rotation;
    psuObj.active = updatePsuInput.active;

    psuObj.power = updatePsuInput.power;
    psuObj.format = updatePsuInput.format;
    psuObj.rating = updatePsuInput.rating;
    psuObj.modular = updatePsuInput.modular;

    return this.psuRepository.save(psuObj);
  }

  async updateStorage(
    updateStorageInput: UpdateStorageInput,
  ): Promise<Storage> {
    console.log(`This updates Storage Device ${updateStorageInput.id}`);
    const parsedId = new ObjectId(updateStorageInput.id);
    const storageObj = await this.storageRepository.findOneBy({
      //@ts-ignore
      _id: parsedId,
      active: true,
    });

    storageObj.name = updateStorageInput.name;
    storageObj.manufacturer = updateStorageInput.manufacturer;
    storageObj.price = updateStorageInput.price;
    storageObj.imageUrl = updateStorageInput.imageUrl;
    storageObj.modelUrl = updateStorageInput.modelUrl;
    storageObj.scale = updateStorageInput.scale;
    storageObj.rotation = updateStorageInput.rotation;
    storageObj.active = updateStorageInput.active;

    storageObj.type = updateStorageInput.type;
    storageObj.formatConnection = updateStorageInput.formatConnection;
    storageObj.capacity = updateStorageInput.capacity;
    storageObj.read = updateStorageInput.read;
    storageObj.write = updateStorageInput.write;

    return this.storageRepository.save(storageObj);
  }

  findAllCases(): Promise<Case[]> {
    console.log(`This action returns all Cases`);
    return this.caseRepository.find({ where: { active: true } });
  }

  findAllCoolers(): Promise<Cooler[]> {
    console.log(`This action returns all Coolers`);
    return this.coolerRepository.find({ where: { active: true } });
  }

  findAllCpus(): Promise<CPU[]> {
    console.log(`This action returns all CPUs`);
    return this.cpuRepository.find({ where: { active: true } });
  }

  findAllCpuCoolers(): Promise<CPUCooler[]> {
    console.log(`This action returns all CPU Coolers`);
    return this.cpuCoolerRepository.find({ where: { active: true } });
  }

  findAllGpus(): Promise<GPU[]> {
    console.log(`This action returns all GPUs`);
    return this.gpuRepository.find({ where: { active: true } });
  }

  findAllMemory(): Promise<Memory[]> {
    console.log(`This action returns all Memory Modules`);
    return this.memoryRepository.find({ where: { active: true } });
  }

  findAllMotherboards(): Promise<Motherboard[]> {
    console.log(`This action returns all Motherboards`);
    return this.motherboardRepository.find({ where: { active: true } });
  }

  findAllPsus(): Promise<PSU[]> {
    console.log(`This action returns all PSUs`);
    return this.psuRepository.find({ where: { active: true } });
  }

  findAllStorage(): Promise<Storage[]> {
    console.log(`This action returns all Storage devices`);
    return this.storageRepository.find({ where: { active: true } });
  }

  resolveCreation = (
    input: CreateDynamicInput,
  ): Promise<typeof ComponentOutputUnion> => {
    switch (input.type) {
      case ObjectTypes.case:
        return this.createCase(input.caseInput);
      case ObjectTypes.cooler:
        return this.createCooler(input.coolerInput);
      case ObjectTypes.cpu:
        return this.createCpu(input.cpuInput);
      case ObjectTypes.cpu_cooler:
        return this.createCpuCooler(input.cpuCoolerInput);
      case ObjectTypes.gpu:
        return this.createGpu(input.gpuInput);
      case ObjectTypes.memory:
        return this.createMemory(input.memoryInput);
      case ObjectTypes.motherboard:
        return this.createMotherboard(input.motherboardInput);
      case ObjectTypes.psu:
        return this.createPsu(input.psuInput);
      case ObjectTypes.storage:
        return this.createStorage(input.storageInput);
      default:
        return null;
    }
  };

  resolveUpdate = (
    input: UpdateDynamicInput,
  ): Promise<typeof ComponentOutputUnion> => {
    switch (input.type) {
      case ObjectTypes.case:
        return this.updateCase(input.caseInput);
      case ObjectTypes.cooler:
        return this.updateCooler(input.coolerInput);
      case ObjectTypes.cpu:
        return this.updateCpu(input.cpuInput);
      case ObjectTypes.cpu_cooler:
        return this.updateCpuCooler(input.cpuCoolerInput);
      case ObjectTypes.gpu:
        return this.updateGpu(input.gpuInput);
      case ObjectTypes.memory:
        return this.updateMemory(input.memoryInput);
      case ObjectTypes.motherboard:
        return this.updateMotherboard(input.motherboardInput);
      case ObjectTypes.psu:
        return this.updatePsu(input.psuInput);
      case ObjectTypes.storage:
        return this.updateStorage(input.storageInput);
      default:
        return null;
    }
  };
}
