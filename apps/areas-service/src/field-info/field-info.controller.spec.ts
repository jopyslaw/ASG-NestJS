import { Test, TestingModule } from '@nestjs/testing';
import { FieldInfoController } from './field-info.controller';
import { FieldInfoService } from './field-info.service';

describe('FieldInfoController', () => {
  let controller: FieldInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldInfoController],
      providers: [FieldInfoService],
    }).compile();

    controller = module.get<FieldInfoController>(FieldInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
