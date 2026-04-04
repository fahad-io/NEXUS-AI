import { Controller, Get, Param, Query } from '@nestjs/common';
import { ModelsService } from './models.service';
import { Public } from '../auth/public.decorator';

@Public()
@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  findAll(@Query('type') type?: string, @Query('lab') lab?: string, @Query('search') search?: string) {
    return this.modelsService.findAll({ type, lab, search });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modelsService.findOne(id);
  }
}
