import { Injectable, NotFoundException } from '@nestjs/common';
import { InventoryRepositoryImpl } from '@/infrastructure/repository/inventory.repository.impl';
import { AddInventoryItemsDto } from '@/shared/dtos/inventory/add-inventory-items.dto';
import { Inventory } from '@/core/domain/entities/inventory.entity';

@Injectable()
export class InventoryUseCase {
  constructor(private readonly inventoryRepo: InventoryRepositoryImpl) {}

  async getInventory(accountId: string): Promise<Inventory> {
    const inv = await this.inventoryRepo.findByAccountId(accountId);
    if (!inv) throw new NotFoundException('Inventory not found');
    return inv;
  }

  async addOrUpdateItems(accountId: string, dto: AddInventoryItemsDto) {
    let inv = await this.inventoryRepo.findByAccountId(accountId);
    if (!inv) {
      inv = Inventory.create({ id: '', accountId, items: [] });
    }
    dto.items.forEach(item => {
      inv.upsertItem({
        itemId: item.itemId,
        quantity: item.quantity,
        expiredDate: item.expiredDate ?? null,
        isLimited: item.isLimited,
      });
    });
    if (!inv.id) {
      return this.inventoryRepo.create(inv);
    }
    return this.inventoryRepo.update(inv.id, inv);
  }

  async removeItem(accountId: string, itemId: string) {
    const inv = await this.inventoryRepo.findByAccountId(accountId);
    if (!inv) throw new NotFoundException('Inventory not found');
    inv.removeItem(itemId);
    return this.inventoryRepo.update(inv.id, inv);
  }
}
