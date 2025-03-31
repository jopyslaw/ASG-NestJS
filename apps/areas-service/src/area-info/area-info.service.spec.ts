import { Test, TestingModule } from '@nestjs/testing';
import { AreaInfoService } from './area-info.service';

describe('AreaInfoService', () => {
  let service: AreaInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AreaInfoService],
    }).compile();

    service = module.get<AreaInfoService>(AreaInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
