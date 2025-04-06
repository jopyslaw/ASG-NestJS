import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from 'src/entities/area.entity';
import { FieldInfo } from 'src/entities/field-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Area, FieldInfo])],
  controllers: [AreaController],
  providers: [AreaService],
  exports: [AreaService],
})
export class AreaModule {}
