import { Mapper } from '@/core/base/mapper';
import { Inventory } from '@/core/domain/entities/inventory.entity';
import { Document, Types } from 'mongoose';

export interface InventoryPersistence extends Document {
  _id: Types.ObjectId;
  id: string;
  accountId: string;
  items: any[];
  createdAt: Date;
  updatedAt: Date;
}

export class InventoryMapper implements Mapper<InventoryPersistence, Inventory> {
  toDomain(raw: Document): Inventory {
    const doc = raw as InventoryPersistence;
    return Inventory.create({
      id: doc.id || doc._id.toString(),
      accountId: doc.accountId,
      items: doc.items as any[],
    });
  }

  toPersistence(entity: Inventory): InventoryPersistence {
    return {
      _id: new Types.ObjectId(),
      id: entity.id,
      accountId: entity.accountId,
      items: entity.items as any[],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as InventoryPersistence;
  }
}
