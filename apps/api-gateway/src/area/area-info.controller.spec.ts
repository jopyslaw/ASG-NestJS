import { Test, TestingModule } from '@nestjs/testing';
import { AreaInfoController } from './area-info.controller';

describe('AreaInfoController', () => {
  let controller: AreaInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreaInfoController],
    }).compile();

    controller = module.get<AreaInfoController>(AreaInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
