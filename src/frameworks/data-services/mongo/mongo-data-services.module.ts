import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATA_BASE_CONFIGURATION } from '@/configuration';
import {
  Account,
  AccountSchema,
  PlayerData,
  PlayerDataSchema,
} from './model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: PlayerData.name, schema: PlayerDataSchema },
    ]),
    MongooseModule.forRoot(DATA_BASE_CONFIGURATION.mongoConnectionString),
  ],
})
export class MongoDataServicesModule {}