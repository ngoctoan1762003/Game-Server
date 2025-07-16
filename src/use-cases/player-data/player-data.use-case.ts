import { Injectable, NotFoundException } from '@nestjs/common';
import { PlayerDataRepositoryImpl } from '@/infrastructure/repository/player-data.repository.impl';
import { AddClearedChapterDto } from '@/shared/dtos/player-data/add-cleared-chapter.dto';
import { AddClearedStageDto } from '@/shared/dtos/player-data/add-cleared-stage.dto';
import { UpdateOwnedUnitDto } from '@/shared/dtos/player-data/update-owned-unit.dto';
import { UpdateUnitSetupDto } from '@/shared/dtos/player-data/update-unit-setup.dto';

@Injectable()
export class PlayerDataUseCase {
    constructor(private readonly playerRepo: PlayerDataRepositoryImpl) { }

    async addClearedChapter(accountId: string, dto: AddClearedChapterDto) {
        const pd = await this.playerRepo.findByAccountId(accountId);
        if (!pd) throw new NotFoundException('PlayerData not found');

        if (!pd.clearedChapterData.includes(dto.chapterId)) {
            pd.clearedChapterData.push(dto.chapterId);
            await this.playerRepo.update(pd.id, pd);
        }
        return pd;
    }

    async addClearedStage(accountId: string, dto: AddClearedStageDto) {
        const pd = await this.playerRepo.findByAccountId(accountId);
        if (!pd) throw new NotFoundException('PlayerData not found');

        if (!pd.clearedStageData.includes(dto.stageId)) {
            pd.clearedStageData.push(dto.stageId);
        }

        if (pd.currentStageData.includes(dto.stageId)) {
            pd.currentStageData.splice(pd.currentStageData.indexOf(dto.stageId), 1);
        }

        if (dto.nextStageId !== "" && !pd.currentStageData.includes(dto.nextStageId)) {
            pd.currentStageData.push(dto.nextStageId);
        }
        await this.playerRepo.update(pd.id, pd);
        return pd;
    }

    async updateOwnedUnit(accountId: string, dto: UpdateOwnedUnitDto) {
        const pd = await this.playerRepo.findByAccountId(accountId);
        if (!pd) throw new NotFoundException('PlayerData not found');

        const unit = pd.ownedUnits.find(u => u.unitID === dto.unitId);
        if (!unit) {
            pd.ownedUnits.push({
                unitID: dto.unitId,
                level: dto.level,
                currentExp: dto.currentExp,
            });
        } else {
            unit.level = dto.level;
            unit.currentExp = dto.currentExp;
        }
        await this.playerRepo.update(pd.id, pd);
        return pd;
    }

    async updateUnitSetup(accountId: string, dto: UpdateUnitSetupDto) {
        const pd = await this.playerRepo.findByAccountId(accountId);
        if (!pd) throw new NotFoundException('PlayerData not found');

        if (dto.slotIndex < 0 || dto.slotIndex > 9) {
            throw new Error('slotIndex must be between 0 and 9');
        }

        // Build dictionary
        const dict: { [key: string]: { x: number; y: number } } = {};
        dto.units.forEach(u => {
            dict[u.unitId] = { x: u.x, y: u.y };
        });

        pd.listUnitSquadSetup[dto.slotIndex] = dict;
        await this.playerRepo.update(pd.id, pd);
        return pd;
    }
}