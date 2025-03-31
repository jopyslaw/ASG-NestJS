import { Test, TestingModule } from '@nestjs/testing';
import { FieldInfoService } from './field-info.service';

describe('FieldInfoService', () => {
  let service: FieldInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FieldInfoService],
    }).compile();

    service = module.get<FieldInfoService>(FieldInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
