import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountRepositoryImpl } from '@/infrastructure/repository/account.repository.impl';
import { PlayerDataRepositoryImpl } from '@/infrastructure/repository/player-data.repository.impl';
import { InventoryRepositoryImpl } from '@/infrastructure/repository/inventory.repository.impl';
import { Account, AccountSchema } from '@/frameworks/data-services/mongo/model/account.model';
import { PlayerData, PlayerDataSchema } from '@/frameworks/data-services/mongo/model/player-data.model';
import { Inventory, InventorySchema } from '@/frameworks/data-services/mongo/model/inventory.model';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: PlayerData.name, schema: PlayerDataSchema },
      { name: Inventory.name, schema: InventorySchema },
    ]),
  ],
  providers: [
    AccountRepositoryImpl,
    PlayerDataRepositoryImpl,
    InventoryRepositoryImpl,
  ],
  exports: [AccountRepositoryImpl, PlayerDataRepositoryImpl, InventoryRepositoryImpl]
})
export class RepositoryModule {}
