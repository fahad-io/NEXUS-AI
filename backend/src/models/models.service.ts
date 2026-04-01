import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface AIModel {
  id: string;
  name: string;
  [key: string]: any;
}

@Injectable()
export class ModelsService {
  private readonly models: AIModel[];

  constructor() {
    const filePath = path.join(__dirname, '..', 'data', 'models.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    this.models = JSON.parse(raw) as AIModel[];
  }

  findAll(): AIModel[] {
    return this.models;
  }

  findOne(id: string): AIModel {
    const model = this.models.find((m) => m.id === id);
    if (!model) throw new NotFoundException(`Model with id "${id}" not found`);
    return model;
  }
}
