import { Repository } from '@/core/base/repository';
import { PlayerData } from '@/core/domain/entities/player-data.entity';

export interface PlayerDataRepository extends Repository<PlayerData> {
  findByAccountId(accountId: string);
}