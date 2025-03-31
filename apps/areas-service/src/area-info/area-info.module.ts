import { Module } from '@nestjs/common';
import { AreaInfoService } from './area-info.service';
import { AreaInfoController } from './area-info.controller';
import { AreaInfo } from 'src/entities/area-info.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaService } from 'src/area/area.service';
import { AreaModule } from 'src/area/area.module';

@Module({
  imports: [TypeOrmModule.forFeature([AreaInfo]), AreaModule],
  controllers: [AreaInfoController],
  providers: [AreaInfoService],
})
export class AreaInfoModule {}
