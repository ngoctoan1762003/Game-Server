import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoGenericRepository } from './mongo-generic-repository';
import { Account as DomainAccount, PlayerData as DomainPlayerData } from '@/core/domain/entities';
import {
    Account,
    AccountDocument,
    PlayerData,
    PlayerDataDocument,
} from './model';

@Injectable()
export class MongoDataServices
{
  private readonly accountRepository: Model<AccountDocument>;
  private readonly playerDataRepository: Model<PlayerDataDocument>;

  constructor(
    @InjectModel(Account.name) accountRepository: Model<AccountDocument>,
    @InjectModel(PlayerData.name) playerDataRepository: Model<PlayerDataDocument>,
  ) {
    this.accountRepository = accountRepository;
    this.playerDataRepository = playerDataRepository;
  }

  private mapAccount(account: AccountDocument): DomainAccount {
    return DomainAccount.create({
      _id: '',
      email: account.email,
      hash_password: account.hash_password,
      salt: account.salt,
      password_reset_token: account.password_reset_token,
      reset_token_expire_time: account.reset_token_expire_time,
      status: account.status,
      image: account.image,
      created_at: account.created_at,
      updated_at: account.updated_at
    });
  }

  private mapPlayerData(playerData: PlayerDataDocument): DomainPlayerData {
    const transformUnitSquadSetup = (squad: any[]): { [key: string]: { x: number; y: number } } => {
      const transformed: { [key: string]: { x: number; y: number } } = {};
      squad.forEach(unit => {
        transformed[unit.unitId] = { x: unit.positionX, y: unit.positionY };
      });
      return transformed;
    };

    return DomainPlayerData.create({
      accountId: playerData.accountId,
      nickname: playerData.nickname,
      clearedStageData: playerData.clearedStageData,
      clearedChapterData: playerData.clearedChapterData,
      completedTutorialIds: playerData.completedTutorialIds,
      ownedUnits: playerData.ownedUnits,
      listUnitSquadSetup: playerData.listUnitSquadSetup.map(squad => transformUnitSquadSetup(squad)),
      id: '',
    });
  }
}