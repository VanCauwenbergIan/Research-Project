import { Injectable } from '@nestjs/common';
import { CreateComponentInput } from './dto/create-component.input';
import { UpdateComponentInput } from './dto/update-component.input';

@Injectable()
export class ComponentsService {
  create(createComponentInput: CreateComponentInput) {
    console.log('This action adds a new component');
  }

  findAll() {
    console.log(`This action returns all components`);
  }

  findOne(id: string) {
    console.log(`This action returns a #${id} component`);
  }

  update(id: string, updateComponentInput: UpdateComponentInput) {
    console.log(`This action updates a #${id} component`);
  }

  remove(id: string) {
    console.log(`This action removes a #${id} component`);
  }
}
