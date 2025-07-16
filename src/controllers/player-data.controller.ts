import { Controller, Post, Param, Body } from '@nestjs/common';
import { PlayerDataUseCase } from '@/use-cases/player-data/player-data.use-case';
import { AddClearedChapterDto } from '@/shared/dtos/player-data/add-cleared-chapter.dto';
import { AddClearedStageDto } from '@/shared/dtos/player-data/add-cleared-stage.dto';
import { UpdateOwnedUnitDto } from '@/shared/dtos/player-data/update-owned-unit.dto';
import { UpdateUnitSetupDto } from '@/shared/dtos/player-data/update-unit-setup.dto';

@Controller('player-data')
export class PlayerDataController {
  constructor(private readonly useCase: PlayerDataUseCase) {}

  @Post(':accountId/cleared-chapter')
  async addClearedChapter(
    @Param('accountId') accountId: string,
    @Body() dto: AddClearedChapterDto,
  ) {
    return this.useCase.addClearedChapter(accountId, dto);
  }

  @Post(':accountId/cleared-stage')
  async addClearedStage(
    @Param('accountId') accountId: string,
    @Body() dto: AddClearedStageDto,
  ) {
    return this.useCase.addClearedStage(accountId, dto);
  }

  @Post(':accountId/owned-unit')
  async updateOwnedUnit(
    @Param('accountId') accountId: string,
    @Body() dto: UpdateOwnedUnitDto,
  ) {
    return this.useCase.updateOwnedUnit(accountId, dto);
  }

  @Post(':accountId/unit-setup')
  async updateUnitSetup(
    @Param('accountId') accountId: string,
    @Body() dto: UpdateUnitSetupDto,
  ) {
    return this.useCase.updateUnitSetup(accountId, dto);
  }
}