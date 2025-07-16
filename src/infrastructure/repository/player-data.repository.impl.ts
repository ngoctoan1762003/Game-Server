import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayerDataRepository } from '@/core/repositories/player-data.repository';
import { PlayerData } from '@/core/domain/entities/player-data.entity';
import { PlayerDataMapper } from '@/core/domain/mappers/player-data.mapper';
const playerDataMapper = new PlayerDataMapper();

@Injectable()
export class PlayerDataRepositoryImpl implements PlayerDataRepository {
  constructor(
    @InjectModel('PlayerData')
    private readonly playerDataModel: Model<PlayerData>
  ) {}

  async findByAccountId(accountId: string): Promise<PlayerData | null> {
    return this.playerDataModel.findOne({ accountId }).exec();
  }

  async create(data: PlayerData): Promise<PlayerData> {
    const persistenceData = playerDataMapper.toPersistence(data);
    const createdData = await this.playerDataModel.create(persistenceData);
    return playerDataMapper.toDomain(createdData);
  }

  async findById(id: string): Promise<PlayerData | null> {
    return this.playerDataModel.findById(id).exec();
  }

  async update(id: string, data: PlayerData): Promise<PlayerData> {
    return this.playerDataModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.playerDataModel.findByIdAndDelete(id).exec();
  }
}
