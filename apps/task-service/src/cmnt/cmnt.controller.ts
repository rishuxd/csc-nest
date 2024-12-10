import { Controller } from '@nestjs/common';
import { CmntService } from './cmnt.service';

@Controller()
export class CmntController {
  constructor(private readonly cmntService: CmntService) {}
}
