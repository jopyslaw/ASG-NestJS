import { Module } from '@nestjs/common';
import { FieldInfoService } from './field-info.service';
import { FieldInfoController } from './field-info.controller';
import { FieldInfo } from 'src/entities/field-info.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaModule } from 'src/area/area.module';

@Module({
  imports: [TypeOrmModule.forFeature([FieldInfo]), AreaModule],
  controllers: [FieldInfoController],
  providers: [FieldInfoService],
})
export class FieldInfoModule {}
