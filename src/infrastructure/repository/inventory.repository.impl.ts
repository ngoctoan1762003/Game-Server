import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InventoryRepository } from '@/core/repositories/inventory.repository';
import { Inventory } from '@/core/domain/entities/inventory.entity';
import { InventoryMapper } from '@/core/domain/mappers/inventory.mapper';
import { Inventory as InventoryDocument } from '@/frameworks/data-services/mongo/model/inventory.model';

const inventoryMapper = new InventoryMapper();

@Injectable()
export class InventoryRepositoryImpl implements InventoryRepository {
  constructor(
    @InjectModel('Inventory')
    private readonly inventoryModel: Model<InventoryDocument>
  ) {}

  async findByAccountId(accountId: string): Promise<Inventory | null> {
    const found = await this.inventoryModel.findOne({ accountId }).exec();
    return found ? inventoryMapper.toDomain(found) : null;
  }

  async create(data: Inventory): Promise<Inventory> {
    const persistence = inventoryMapper.toPersistence(data);
    const created = await this.inventoryModel.create(persistence);
    return inventoryMapper.toDomain(created);
  }

  async findById(id: string): Promise<Inventory | null> {
    const found = await this.inventoryModel.findById(id).exec();
    return found ? inventoryMapper.toDomain(found) : null;
  }

  async update(id: string, data: Inventory): Promise<Inventory> {
    const persistence = inventoryMapper.toPersistence(data);

    // Do not attempt to overwrite the immutable `_id` field during update
    const { _id, createdAt, updatedAt, ...updatable } = persistence as any;

    const updated = await this.inventoryModel
      .findByIdAndUpdate(id, { $set: { ...updatable, updatedAt: new Date() } }, { new: true })
      .exec();

    return inventoryMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.inventoryModel.findByIdAndDelete(id).exec();
  }
}
