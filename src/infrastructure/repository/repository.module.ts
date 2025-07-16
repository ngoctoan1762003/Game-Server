import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountRepositoryImpl } from './account.repository.impl';
import { PlayerDataRepositoryImpl } from './player-data.repository.impl';
import { Account, AccountSchema } from '@/frameworks/data-services/mongo/model/account.model';
import { PlayerData, PlayerDataSchema } from '@/frameworks/data-services/mongo/model/player-data.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: PlayerData.name, schema: PlayerDataSchema },
    ]),
  ],
  providers: [
    AccountRepositoryImpl,
    PlayerDataRepositoryImpl,
  ],
  exports: [AccountRepositoryImpl, PlayerDataRepositoryImpl]
})
export class RepositoryModule {}
