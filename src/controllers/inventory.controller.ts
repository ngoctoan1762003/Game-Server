import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '@/common/guard/jwt-auth.guard';
import { InventoryUseCase } from '@/use-cases/inventory/inventory.use-case';
import { AddInventoryItemsDto } from '@/shared/dtos/inventory/add-inventory-items.dto';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly useCase: InventoryUseCase) {}

  @Get()
  async getInventory(@Req() req: Request) {
    const accountId = (req as any).user.userId;
    return this.useCase.getInventory(accountId);
  }

  @Post()
  async addOrUpdate(
    @Req() req: Request,
    @Body() dto: AddInventoryItemsDto,
  ) {
    const accountId = (req as any).user.userId;
    return this.useCase.addOrUpdateItems(accountId, dto);
  }
}
