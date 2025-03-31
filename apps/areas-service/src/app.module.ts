import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AreaModule } from './area/area.module';
import { AreaInfoModule } from './area-info/area-info.module';
import { FieldInfoModule } from './field-info/field-info.module';
import dbConfigDev from './config/db.config.dev';
import dbConfigProd from './config/db.config.prod';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [dbConfigDev, dbConfigProd],
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV === 'production' ? dbConfigProd : dbConfigDev,
    }),
    AreaModule,
    AreaInfoModule,
    FieldInfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
