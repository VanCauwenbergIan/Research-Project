import { Injectable } from '@nestjs/common';
import { CreateComponentInput } from './dto/create-component.input';
import { UpdateComponentInput } from './dto/update-component.input';

@Injectable()
export class ComponentsService {
  create(createComponentInput: CreateComponentInput) {
    return 'This action adds a new component';
  }

  findAll() {
    return `This action returns all components`;
  }

  findOne(id: number) {
    return `This action returns a #${id} component`;
  }

  update(id: number, updateComponentInput: UpdateComponentInput) {
    return `This action updates a #${id} component`;
  }

  remove(id: number) {
    return `This action removes a #${id} component`;
  }
}
