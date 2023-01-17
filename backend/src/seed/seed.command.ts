import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { DatabaseSeedService } from './seed.service';

@Injectable()
export class DatabaseSeedCommand {
  constructor(private readonly seedService: DatabaseSeedService) {}

  @Command({
    command: 'seed:database',
    describe: 'seed the database',
  })
  async seed() {
    console.log('Start seeding...');
    const cases = await this.seedService.addAllCases();
    const coolers = await this.seedService.addAllCoolers();
    const cpus = await this.seedService.addAllCPUs();
    const cpuCoolers = await this.seedService.addAllCPUCoolers();
    const gpus = await this.seedService.addAllGPUs();
    const memory = await this.seedService.addAllMemory();
    const motherboards = await this.seedService.addAllMotherboards();
    const psus = await this.seedService.addAllPSUs();
    const storage = await this.seedService.addAllStorage();
    console.log(
      cases,
      coolers,
      cpus,
      cpuCoolers,
      gpus,
      memory,
      motherboards,
      psus,
      storage,
    );
    console.log('Seeding completed!');
  }

  @Command({
    command: 'seed:reset',
    describe: 'delete all data from the database',
  })
  async delete() {
    console.log('Started dropping the database...');
    await this.seedService.deleteAllCases();
    await this.seedService.deleteAllCoolers();
    await this.seedService.deleteAllCPUs();
    await this.seedService.deleteAllCPUCoolers();
    await this.seedService.deleteAllGPUs();
    await this.seedService.deleteAllMemory();
    await this.seedService.deleteAllMotherboards();
    await this.seedService.deleteAllPSUs();
    await this.seedService.deleteAllStorage();
    console.log('Database emptied!');
  }
}
