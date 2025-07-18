import { Injectable, NotFoundException } from '@nestjs/common';
import { InventoryRepositoryImpl } from '@/infrastructure/repository/inventory.repository.impl';
import { AddInventoryItemsDto } from '@/shared/dtos/inventory/add-inventory-items.dto';
import { Inventory } from '@/core/domain/entities/inventory.entity';

@Injectable()
export class InventoryUseCase {
  constructor(private readonly inventoryRepo: InventoryRepositoryImpl) {}

  async getInventory(accountId: string) {
    const inv = await this.inventoryRepo.findByAccountId(accountId);
    if (!inv) throw new NotFoundException('Inventory not found');
    return { items: inv.items };
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
      await this.inventoryRepo.create(inv);
    } else {
      await this.inventoryRepo.update(inv.id, inv);
    }
    return { success: true, message: 'OK' };
  }

  async removeItem(accountId: string, itemId: string) {
    const inv = await this.inventoryRepo.findByAccountId(accountId);
    if (!inv) throw new NotFoundException('Inventory not found');
    inv.removeItem(itemId);
    await this.inventoryRepo.update(inv.id, inv);
  }
}
