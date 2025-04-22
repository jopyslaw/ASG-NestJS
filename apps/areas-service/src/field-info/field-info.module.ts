import { Module } from '@nestjs/common';
import { FieldInfoService } from './field-info.service';
import { FieldInfoController } from './field-info.controller';
import { FieldInfo } from 'src/entities/field-info.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaModule } from 'src/area/area.module';
import { AreaService } from 'src/area/area.service';
import { Area } from 'src/entities/area.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FieldInfo, Area])],
  controllers: [FieldInfoController],
  providers: [FieldInfoService, AreaService],
  exports: [FieldInfoService],
})
export class FieldInfoModule {}
