import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Case,
  Cooler,
  CPU,
  CPUCooler,
  GPU,
  Memory,
  MemoryTypes,
  MoboTypes,
  Motherboard,
  ObjectTypes,
  PSU,
  SocketTypes,
  Storage,
  StorageFormats,
  StorageTypes,
  VramTypes,
} from 'src/components/entities/component.entity';
import { Repository } from 'typeorm';
import * as casesSeed from './data/cases.json';
import * as coolersSeed from './data/coolers.json';
import * as cpuCoolersSeed from './data/cpucoolers.json';
import * as cpusSeed from './data/cpus.json';
import * as gpusSeed from './data/gpus.json';
import * as memorySeed from './data/memory.json';
import * as motherboardsSeed from './data/motherboards.json';
import * as psusSeed from './data/psus.json';
import * as storageSeed from './data/storage.json';

@Injectable()
export class DatabaseSeedService {
  constructor(
    @InjectRepository(Case)
    private caseRepository: Repository<Case>,
    @InjectRepository(Cooler)
    private coolerRepository: Repository<Cooler>,
    @InjectRepository(CPU)
    private cpuRepository: Repository<CPU>,
    @InjectRepository(CPUCooler)
    private cpuCoolerRepository: Repository<CPUCooler>,
    @InjectRepository(GPU)
    private gpuRepository: Repository<GPU>,
    @InjectRepository(Memory)
    private memoryRepository: Repository<Memory>,
    @InjectRepository(Motherboard)
    private motherboardRepository: Repository<Motherboard>,
    @InjectRepository(PSU)
    private psuRepository: Repository<PSU>,
    @InjectRepository(Storage)
    private storageRepository: Repository<Storage>,
  ) {}

  async addAllCases(): Promise<Case[]> {
    let cases: Case[] = [];

    for (let jsonCase of casesSeed) {
      const newCase = new Case();

      newCase.name = jsonCase.name;
      newCase.objectType = jsonCase.objectType as ObjectTypes;
      newCase.manufacturer = jsonCase.manufacturer;
      newCase.price = jsonCase.price;
      newCase.imageUrl = jsonCase.imageUrl;
      newCase.modelUrl = jsonCase.modelUrl;
      newCase.scale = jsonCase.scale;
      newCase.rotation = jsonCase.rotation;
      newCase.active = jsonCase.active;

      newCase.supportedMotherboardFormats =
        jsonCase.supportedMotherboardFormats as MoboTypes[];
      newCase.maxLengthGPU = jsonCase.maxLengthGPU;
      newCase.pciSlots = jsonCase.pciSlots;
      newCase.psuBB = jsonCase.psuBB;
      newCase.motherboardBB = jsonCase.motherboardBB;
      newCase.drivesBB = jsonCase.drivesBB;
      newCase.fansBB = jsonCase.fansBB;

      cases.push(newCase);
    }

    return this.caseRepository.save(cases);
  }

  async addAllCoolers(): Promise<Cooler[]> {
    let coolers: Cooler[] = [];

    for (let jsonCooler of coolersSeed) {
      const newCooler = new Cooler();

      newCooler.name = jsonCooler.name;
      newCooler.objectType = jsonCooler.objectType as ObjectTypes;
      newCooler.manufacturer = jsonCooler.manufacturer;
      newCooler.price = jsonCooler.price;
      newCooler.imageUrl = jsonCooler.imageUrl;
      newCooler.modelUrl = jsonCooler.modelUrl;
      newCooler.scale = jsonCooler.scale;
      newCooler.rotation = jsonCooler.rotation;
      newCooler.active = jsonCooler.active;

      newCooler.diameter = jsonCooler.diameter;
      newCooler.noise = jsonCooler.noise;

      coolers.push(newCooler);
    }

    return this.coolerRepository.save(coolers);
  }

  async addAllCPUs(): Promise<CPU[]> {
    let cpus: CPU[] = [];

    for (let jsonCpu of cpusSeed) {
      const newCpu = new CPU();

      newCpu.name = jsonCpu.name;
      newCpu.objectType = jsonCpu.objectType as ObjectTypes;
      newCpu.manufacturer = jsonCpu.manufacturer;
      newCpu.price = jsonCpu.price;
      newCpu.imageUrl = jsonCpu.imageUrl;
      newCpu.modelUrl = jsonCpu.modelUrl;
      newCpu.scale = jsonCpu.scale;
      newCpu.rotation = jsonCpu.rotation;
      newCpu.active = jsonCpu.active;

      newCpu.series = jsonCpu.series;
      newCpu.integratedGraphics = jsonCpu.integratedGraphics;
      newCpu.socket = jsonCpu.socket as SocketTypes;
      newCpu.coreCount = jsonCpu.coreCount;
      newCpu.threadCount = jsonCpu.threadCount;
      newCpu.clockSpeed = jsonCpu.clockSpeed;
      newCpu.cacheSize = jsonCpu.cacheSize;
      newCpu.tdp = jsonCpu.tdp;
      newCpu.coolerBB = jsonCpu.coolerBB;

      cpus.push(newCpu);
    }

    return this.cpuRepository.save(cpus);
  }

  async addAllCPUCoolers(): Promise<CPUCooler[]> {
    let cpuCoolers: CPUCooler[] = [];

    for (let jsonCpuCooler of cpuCoolersSeed) {
      const newCpuCooler = new CPUCooler();

      newCpuCooler.name = jsonCpuCooler.name;
      newCpuCooler.objectType = jsonCpuCooler.objectType as ObjectTypes;
      newCpuCooler.manufacturer = jsonCpuCooler.manufacturer;
      newCpuCooler.price = jsonCpuCooler.price;
      newCpuCooler.imageUrl = jsonCpuCooler.imageUrl;
      newCpuCooler.modelUrl = jsonCpuCooler.modelUrl;
      newCpuCooler.scale = jsonCpuCooler.scale;
      newCpuCooler.rotation = jsonCpuCooler.rotation;
      newCpuCooler.active = jsonCpuCooler.active;

      newCpuCooler.diameter = jsonCpuCooler.diameter;
      newCpuCooler.noise = jsonCpuCooler.noise;

      newCpuCooler.supportedSockets =
        jsonCpuCooler.supportedSockets as SocketTypes[];
      newCpuCooler.tdp = jsonCpuCooler.tdp;

      cpuCoolers.push(newCpuCooler);
    }

    return this.cpuCoolerRepository.save(cpuCoolers);
  }

  async addAllGPUs(): Promise<GPU[]> {
    let gpus: GPU[] = [];

    for (let jsonGpu of gpusSeed) {
      const newGpu = new GPU();

      newGpu.name = jsonGpu.name;
      newGpu.objectType = jsonGpu.objectType as ObjectTypes;
      newGpu.manufacturer = jsonGpu.manufacturer;
      newGpu.price = jsonGpu.price;
      newGpu.imageUrl = jsonGpu.imageUrl;
      newGpu.modelUrl = jsonGpu.modelUrl;
      newGpu.scale = jsonGpu.scale;
      newGpu.rotation = jsonGpu.rotation;
      newGpu.active = jsonGpu.active;

      newGpu.series = jsonGpu.series;
      newGpu.vramSize = jsonGpu.vramSize;
      newGpu.vramType = jsonGpu.vramType as VramTypes;
      newGpu.length = jsonGpu.length;
      newGpu.tdp = jsonGpu.tdp;
      newGpu.slots = jsonGpu.slots;
      newGpu.cores = jsonGpu.cores;
      newGpu.clockSpeed = jsonGpu.clockSpeed;

      gpus.push(newGpu);
    }

    return this.gpuRepository.save(gpus);
  }

  async addAllMemory(): Promise<Memory[]> {
    let memory: Memory[] = [];

    for (let jsonMemory of memorySeed) {
      const newMemory = new Memory();

      newMemory.name = jsonMemory.name;
      newMemory.objectType = jsonMemory.objectType as ObjectTypes;
      newMemory.manufacturer = jsonMemory.manufacturer;
      newMemory.price = jsonMemory.price;
      newMemory.imageUrl = jsonMemory.imageUrl;
      newMemory.modelUrl = jsonMemory.modelUrl;
      newMemory.scale = jsonMemory.scale;
      newMemory.rotation = jsonMemory.rotation;
      newMemory.active = jsonMemory.active;

      newMemory.generation = jsonMemory.generation as MemoryTypes;
      newMemory.size = jsonMemory.size;
      newMemory.speed = jsonMemory.speed;

      memory.push(newMemory);
    }

    return this.memoryRepository.save(memory);
  }

  async addAllMotherboards(): Promise<Motherboard[]> {
    let motherboards: Motherboard[] = [];

    for (let jsonMotherboard of motherboardsSeed) {
      const newMotherboard = new Motherboard();

      newMotherboard.name = jsonMotherboard.name;
      newMotherboard.objectType = jsonMotherboard.objectType as ObjectTypes;
      newMotherboard.manufacturer = jsonMotherboard.manufacturer;
      newMotherboard.price = jsonMotherboard.price;
      newMotherboard.imageUrl = jsonMotherboard.imageUrl;
      newMotherboard.modelUrl = jsonMotherboard.modelUrl;
      newMotherboard.scale = jsonMotherboard.scale;
      newMotherboard.rotation = jsonMotherboard.rotation;
      newMotherboard.active = jsonMotherboard.active;

      newMotherboard.format = jsonMotherboard.format as MoboTypes;
      newMotherboard.socket = jsonMotherboard.socket as SocketTypes;
      newMotherboard.chipset = jsonMotherboard.chipset;
      newMotherboard.supportedMemoryTypes =
        jsonMotherboard.supportedMemoryTypes as MemoryTypes[];
      newMotherboard.memorySlots = jsonMotherboard.memorySlots;
      newMotherboard.maxMemory = jsonMotherboard.maxMemory;
      newMotherboard.cpuBB = jsonMotherboard.cpuBB;
      newMotherboard.ramBB = jsonMotherboard.ramBB;
      newMotherboard.gpuBB = jsonMotherboard.gpuBB;

      motherboards.push(newMotherboard);
    }

    return this.motherboardRepository.save(motherboards);
  }

  async addAllPSUs(): Promise<PSU[]> {
    let psus: PSU[] = [];

    for (let jsonPsu of psusSeed) {
      const newPsu = new PSU();

      newPsu.name = jsonPsu.name;
      newPsu.objectType = jsonPsu.objectType as ObjectTypes;
      newPsu.manufacturer = jsonPsu.manufacturer;
      newPsu.price = jsonPsu.price;
      newPsu.imageUrl = jsonPsu.imageUrl;
      newPsu.modelUrl = jsonPsu.modelUrl;
      newPsu.scale = jsonPsu.scale;
      newPsu.rotation = jsonPsu.rotation;
      newPsu.active = jsonPsu.active;

      newPsu.power = jsonPsu.power;
      newPsu.format = jsonPsu.format as MoboTypes;
      newPsu.rating = jsonPsu.rating;
      newPsu.modular = jsonPsu.modular;

      psus.push(newPsu);
    }

    return this.psuRepository.save(psus);
  }

  async addAllStorage(): Promise<Storage[]> {
    let storage: Storage[] = [];

    for (let jsonStorage of storageSeed) {
      const newStorage = new Storage();

      newStorage.name = jsonStorage.name;
      newStorage.objectType = jsonStorage.objectType as ObjectTypes;
      newStorage.manufacturer = jsonStorage.manufacturer;
      newStorage.price = jsonStorage.price;
      newStorage.imageUrl = jsonStorage.imageUrl;
      newStorage.modelUrl = jsonStorage.modelUrl;
      newStorage.scale = jsonStorage.scale;
      newStorage.rotation = jsonStorage.rotation;
      newStorage.active = jsonStorage.active;

      newStorage.type = jsonStorage.type as StorageTypes;
      newStorage.formatConnection =
        jsonStorage.formatConnection as StorageFormats;
      newStorage.capacity = jsonStorage.capacity;
      newStorage.read = jsonStorage.read;
      newStorage.write = jsonStorage.write;

      storage.push(newStorage);
    }

    return this.storageRepository.save(storage);
  }

  async deleteAllCases(): Promise<void> {
    await this.caseRepository.delete({});
    return Promise.resolve();
  }

  async deleteAllCoolers(): Promise<void> {
    await this.coolerRepository.delete({});
    return Promise.resolve();
  }

  async deleteAllCPUs(): Promise<void> {
    await this.cpuRepository.delete({});
    return Promise.resolve();
  }

  async deleteAllCPUCoolers(): Promise<void> {
    await this.cpuCoolerRepository.delete({});
    return Promise.resolve();
  }

  async deleteAllGPUs(): Promise<void> {
    await this.gpuRepository.delete({});
    return Promise.resolve();
  }

  async deleteAllMemory(): Promise<void> {
    await this.memoryRepository.delete({});
    return Promise.resolve();
  }

  async deleteAllMotherboards(): Promise<void> {
    await this.motherboardRepository.delete({});
    return Promise.resolve();
  }

  async deleteAllPSUs(): Promise<void> {
    await this.psuRepository.delete({});
    return Promise.resolve();
  }

  async deleteAllStorage(): Promise<void> {
    await this.storageRepository.delete({});
    return Promise.resolve();
  }
}
