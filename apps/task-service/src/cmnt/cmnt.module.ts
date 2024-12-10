import { Module } from '@nestjs/common';
import { CmntService } from './cmnt.service';
import { CmntController } from './cmnt.controller';

@Module({
  controllers: [CmntController],
  providers: [CmntService],
})
export class CmntModule {}
