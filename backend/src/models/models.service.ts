import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { AIModel, ModelDocument } from '../schemas/model.schema';

@Injectable()
export class ModelsService implements OnModuleInit {
  private readonly logger = new Logger(ModelsService.name);

  constructor(@InjectModel(AIModel.name) private modelDoc: Model<ModelDocument>) {}

  async onModuleInit() {
    const count = await this.modelDoc.countDocuments();
    if (count === 0) {
      await this.seedFromJson();
    }
  }

  private async seedFromJson() {
    try {
      const filePath = path.join(__dirname, '..', 'data', 'models.json');
      const raw = fs.readFileSync(filePath, 'utf-8');
      const models = JSON.parse(raw) as AIModel[];
      await this.modelDoc.insertMany(models, { ordered: false });
      this.logger.log(`Seeded ${models.length} models into MongoDB`);
    } catch (err) {
      this.logger.error('Failed to seed models', err);
    }
  }

  async findAll(filter?: { type?: string; lab?: string; search?: string }): Promise<ModelDocument[]> {
    const query: any = {};
    if (filter?.type && filter.type !== 'all') {
      if (filter.type === 'open') {
        query['price_start'] = 0;
      } else {
        query['types'] = filter.type;
      }
    }
    if (filter?.lab) query['lab'] = filter.lab;
    if (filter?.search) {
      query['$or'] = [
        { name: { $regex: filter.search, $options: 'i' } },
        { desc: { $regex: filter.search, $options: 'i' } },
        { org:  { $regex: filter.search, $options: 'i' } },
      ];
    }
    return this.modelDoc.find(query).exec();
  }

  async findOne(id: string): Promise<ModelDocument> {
    const model = await this.modelDoc.findOne({ id }).exec();
    if (!model) throw new NotFoundException(`Model "${id}" not found`);
    return model;
  }
}
