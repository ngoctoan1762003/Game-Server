import { Mapper } from '@/core/base/mapper';
import { PlayerData } from '@/core/domain/entities/player-data.entity';
import { Document, Types } from 'mongoose';

export interface PlayerDataPersistence extends Document {
  _id: Types.ObjectId;
  id: string;
  accountId: string;
  nickname: string;
  clearedStageData: string[];
  clearedChapterData: string[];
  completedTutorialIds: string[];
  ownedUnits: any[];
  listUnitSquadSetup: any[];
  createdAt: Date;
  updatedAt: Date;
}

export class PlayerDataMapper implements Mapper<PlayerDataPersistence, PlayerData> {
  toDomain(raw: Document): PlayerData {
    const doc = raw as PlayerDataPersistence;
    return PlayerData.create({
      id: doc.id || doc._id.toString(),
      accountId: doc.accountId,
      nickname: doc.nickname,
      clearedStageData: doc.clearedStageData,
      clearedChapterData: doc.clearedChapterData,
      completedTutorialIds: doc.completedTutorialIds,
      ownedUnits: doc.ownedUnits as any,
      listUnitSquadSetup: doc.listUnitSquadSetup as any[],
    });
  }

  toPersistence(entity: PlayerData): PlayerDataPersistence {
    return {
      _id: new Types.ObjectId(),
      id: entity.id,
      accountId: entity.accountId,
      nickname: entity.nickname,
      clearedStageData: entity.clearedStageData,
      clearedChapterData: entity.clearedChapterData,
      completedTutorialIds: entity.completedTutorialIds,
      ownedUnits: entity.ownedUnits as any[],
      listUnitSquadSetup: entity.listUnitSquadSetup as any[],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as PlayerDataPersistence;
  }
}
