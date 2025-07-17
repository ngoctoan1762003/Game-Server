import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { InventoryUseCase } from '@/use-cases/inventory/inventory.use-case';
import { AddInventoryItemsDto } from '@/shared/dtos/inventory/add-inventory-items.dto';

@Controller('player-data/:accountId/inventory')
export class InventoryController {
  constructor(private readonly useCase: InventoryUseCase) {}

  @Get()
  async getInventory(@Param('accountId') accountId: string) {
    return this.useCase.getInventory(accountId);
  }

  @Post()
  async addOrUpdate(
    @Param('accountId') accountId: string,
    @Body() dto: AddInventoryItemsDto,
  ) {
    return this.useCase.addOrUpdateItems(accountId, dto);
  }
}
