import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';
import { AIModel, AIModelSchema } from '../schemas/model.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: AIModel.name, schema: AIModelSchema }])],
  controllers: [ModelsController],
  providers: [ModelsService],
  exports: [ModelsService],
})
export class ModelsModule {}
