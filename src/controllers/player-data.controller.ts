import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '@/common/guard/jwt-auth.guard';
import { PlayerDataUseCase } from '@/use-cases/player-data/player-data.use-case';
import { AddClearedChapterDto } from '@/shared/dtos/player-data/add-cleared-chapter.dto';
import { AddClearedStageDto } from '@/shared/dtos/player-data/add-cleared-stage.dto';
import { UpdateOwnedUnitDto } from '@/shared/dtos/player-data/update-owned-unit.dto';
import { UpdateUnitSetupDto } from '@/shared/dtos/player-data/update-unit-setup.dto';

@Controller('player-data')
@UseGuards(JwtAuthGuard)
export class PlayerDataController {
  constructor(private readonly useCase: PlayerDataUseCase) {}
  @Get()
  async getPlayerData(@Req() req: Request) {
    const accountId = (req as any).user.userId;
    return this.useCase.getPlayerData(accountId);
  }

  @Post('cleared-chapter')
  async addClearedChapter(
    @Req() req: Request,
    @Body() dto: AddClearedChapterDto,
  ) {
    const accountId = (req as any).user.userId;
    return this.useCase.addClearedChapter(accountId, dto);
  }

  @Post('cleared-stage')
  async addClearedStage(
    @Req() req: Request,
    @Body() dto: AddClearedStageDto,
  ) {
    const accountId = (req as any).user.userId;
    return this.useCase.addClearedStage(accountId, dto);
  }

  @Post('owned-unit')
  async updateOwnedUnit(
    @Req() req: Request,
    @Body() dto: UpdateOwnedUnitDto,
  ) {
    const accountId = (req as any).user.userId;
    return this.useCase.updateOwnedUnit(accountId, dto);
  }

  @Post('unit-setup')
  async updateUnitSetup(
    @Req() req: Request,
    @Body() dto: UpdateUnitSetupDto,
  ) {
    const accountId = (req as any).user.userId;
    return this.useCase.updateUnitSetup(accountId, dto);
  }
}