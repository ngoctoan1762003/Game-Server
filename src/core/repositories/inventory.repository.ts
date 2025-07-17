import { Repository } from '@/core/base/repository';
import { Inventory } from '@/core/domain/entities/inventory.entity';

export interface InventoryRepository extends Repository<Inventory> {
  findByAccountId(accountId: string): Promise<Inventory | null>;
}
