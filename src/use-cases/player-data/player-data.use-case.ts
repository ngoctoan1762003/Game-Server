import { Injectable, NotFoundException } from '@nestjs/common';
import { PlayerDataRepositoryImpl } from '@/infrastructure/repository/player-data.repository.impl';
import { AddClearedChapterDto } from '@/shared/dtos/player-data/add-cleared-chapter.dto';
import { AddClearedStageDto } from '@/shared/dtos/player-data/add-cleared-stage.dto';
import { UpdateOwnedUnitDto } from '@/shared/dtos/player-data/update-owned-unit.dto';
import { UpdateUnitSetupDto } from '@/shared/dtos/player-data/update-unit-setup.dto';
import { UNIT_POOL } from '@/shared/data/unit-pool';
import { InventoryRepositoryImpl } from '@/infrastructure/repository/inventory.repository.impl';
import { Inventory } from '@/core/domain/entities/inventory.entity';

@Injectable()
export class PlayerDataUseCase {
    async getPlayerData(accountId: string) {
        const pd = await this.playerRepo.findByAccountId(accountId);
        if (!pd) throw new NotFoundException('PlayerData not found');
        return {
            clearedStageData: pd.clearedStageData,
            clearedChapterData: pd.clearedChapterData,
            currentStageData: pd.currentStageData,
            ownedUnits: pd.ownedUnits,
            listUnitSquadSetup: pd.listUnitSquadSetup.map(slot =>
                Object.entries(slot).map(([unitID, pos]: [string, { x: number; y: number }]) => ({
                    unitID,
                    x: pos.x,
                    y: pos.y,
                }))),
        };
    }
    constructor(
        private readonly playerRepo: PlayerDataRepositoryImpl,
        private readonly inventoryRepo: InventoryRepositoryImpl,
    ) { }

    async addClearedChapter(accountId: string, dto: AddClearedChapterDto) {
        const pd = await this.playerRepo.findByAccountId(accountId);
        if (!pd) throw new NotFoundException('PlayerData not found');

        if (!pd.clearedChapterData.includes(dto.chapterId)) {
            pd.clearedChapterData.push(dto.chapterId);
            await this.playerRepo.update(pd.id, pd);
        }
        return { success: true, message: 'OK' };
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

        await this.playerRepo.update(pd.id, pd);
        return { success: true, message: 'OK' };
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
                tier: dto.tier,
            });
        } else {
            unit.level = dto.level;
            unit.currentExp = dto.currentExp;
            unit.tier = dto.tier;
        }
        await this.playerRepo.update(pd.id, pd);
        return { success: true, message: 'OK' };
    }

    /**
     * Roll gacha exactly one time and persist the result
     */
    async rollGacha(accountId: string) {
        const pd = await this.playerRepo.findByAccountId(accountId);
        if (!pd) throw new NotFoundException('PlayerData not found');

        // Determine rarity based on probability distribution
        const random = Math.random() * 100; // 0-100
        let rarity: 'SSR' | 'SR' | 'R' | 'N' | 'C';
        if (random < 2) rarity = 'SSR';
        else if (random < 2 + 5) rarity = 'SR'; // 2-7
        else if (random < 2 + 5 + 10) rarity = 'R'; // 7-17
        else if (random < 2 + 5 + 10 + 23) rarity = 'N'; // 17-40
        else rarity = 'C';

        // Retrieve candidates from pool
        const candidates = UNIT_POOL.filter(u => u.rarity === rarity);
        if (candidates.length === 0) {
            throw new Error(`No unit in pool for rarity ${rarity}`);
        }
        const selected = candidates[Math.floor(Math.random() * candidates.length)];

        // Determine if new and persist
        const existed = pd.ownedUnits.find(u => u.unitID === selected.unitId);
        let isNew = false;
        if (!existed) {
            // new unit
            isNew = true;
            pd.ownedUnits.push({ unitID: selected.unitId, level: 1, currentExp: 0, tier: 0 });
            await this.playerRepo.update(pd.id, pd);
        } else {
            // duplicate -> add token to inventory
            await this.addTokenToInventory(accountId, selected.unitId, 1);
        }

        return { unitId: selected.unitId, rarity, isNew };
    }

    /**
     * Roll gacha multiple times (default 10).
     * Saves newly obtained units in one DB update for efficiency.
     */
    async rollGachaMultiple(accountId: string, times = 10) {
        const pd = await this.playerRepo.findByAccountId(accountId);
        if (!pd) throw new NotFoundException('PlayerData not found');

        const results: { unitId: string; rarity: 'SSR' | 'SR' | 'R' | 'N' | 'C'; isNew: boolean }[] = [];
        const newlyObtained: { unitID: string; level: number; currentExp: number; tier: number }[] = [];
        const tokenCounter: Record<string, number> = {};

        for (let i = 0; i < times; i++) {
            // reuse single roll logic but without DB call each time
            const random = Math.random() * 100;
            let rarity: 'SSR' | 'SR' | 'R' | 'N' | 'C';
            if (random < 2) rarity = 'SSR';
            else if (random < 2 + 5) rarity = 'SR';
            else if (random < 2 + 5 + 10) rarity = 'R';
            else if (random < 2 + 5 + 10 + 23) rarity = 'N';
            else rarity = 'C';

            const candidates = UNIT_POOL.filter(u => u.rarity === rarity);
            if (candidates.length === 0) throw new Error(`No unit in pool for rarity ${rarity}`);
            const selected = candidates[Math.floor(Math.random() * candidates.length)];

            const exists = pd.ownedUnits.find(u => u.unitID === selected.unitId) || newlyObtained.find(u => u.unitID === selected.unitId);
            let isNew = false;
            if (!exists) {
                isNew = true;
                newlyObtained.push({ unitID: selected.unitId, level: 1, currentExp: 0, tier: 0 });
            } else {
                tokenCounter[selected.unitId] = (tokenCounter[selected.unitId] || 0) + 1;
            }
            results.push({ unitId: selected.unitId, rarity, isNew });
        }

        // Persist changes
        if (newlyObtained.length > 0) {
            pd.ownedUnits.push(...newlyObtained);
            await this.playerRepo.update(pd.id, pd);
        }
        // Add tokens for duplicates
        for (const [unitId, qty] of Object.entries(tokenCounter)) {
            await this.addTokenToInventory(accountId, unitId, qty);
        }

        return { results };
    }

    /**
     * Helper to add token item to inventory (Token_<UnitID>) with given quantity
     */
    private async addTokenToInventory(accountId: string, unitId: string, quantity: number) {
        let inv = await this.inventoryRepo.findByAccountId(accountId);
        if (!inv) {
            inv = Inventory.create({ id: '', accountId, items: [] });
        }
        const tokenId = `Token_${unitId}`;
        inv.upsertItem({ itemId: tokenId, quantity, expiredDate: null, isLimited: false });
        if (!inv.id) {
            await this.inventoryRepo.create(inv);
        } else {
            await this.inventoryRepo.update(inv.id, inv);
        }
    }

    async updateUnitSetup(accountId: string, dto: UpdateUnitSetupDto) {
        const pd = await this.playerRepo.findByAccountId(accountId);
        if (!pd) throw new NotFoundException('PlayerData not found');

        console.log(dto);
        if (dto.slotIndex < 0 || dto.slotIndex > 9) {
            throw new Error('slotIndex must be between 0 and 9');
        }

        // Build dictionary
        const dict: { [key: string]: { x: number; y: number } } = {};
        console.log(dto.units);
        dto.units.forEach(u => {
            dict[u.unitId] = { x: u.x, y: u.y };
            console.log(dict);
        });

        pd.listUnitSquadSetup[dto.slotIndex] = dict;
        await this.playerRepo.update(pd.id, pd);
        return { success: true, message: 'OK' };
    }
}