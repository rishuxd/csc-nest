import { Module } from '@nestjs/common';
import { CmntService } from './cmnt.service';
import { CmntController } from './cmnt.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CmntSchema } from './schema/cmnt.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([{ name: 'Cmnt', schema: CmntSchema }]),
  ],
  controllers: [CmntController],
  providers: [CmntService],
})
export class CmntModule {}
