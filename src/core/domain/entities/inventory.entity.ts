import { Entity } from '@/core/base/entity';

export interface InventoryItem {
  itemId: string;
  quantity: number;
  expiredDate: Date | null; // null ⇒ never expires
  isLimited: boolean;
}

export interface InventoryProps {
  id: string;
  accountId: string;
  items: InventoryItem[];
  createdAt: Date;
}

export class Inventory extends Entity<InventoryProps> {
  private constructor(props: InventoryProps) {
    super(props);
  }

  static create(props: Omit<InventoryProps, 'createdAt'>) {
    return new Inventory({
      ...props,
      items: props.items ?? [],
      createdAt: new Date(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get accountId(): string {
    return this.props.accountId;
  }

  get items(): InventoryItem[] {
    return this.props.items;
  }

  /**
   * Add or reduce quantity of a single item.
   * - If the item exists, only the quantity is adjusted by `item.quantity` rather than overwritten.
   * - `expiredDate` and `isLimited` are NOT updated on existing items.
   * - If the resulting quantity is 0 or less, the item is removed from the inventory.
   * - If the item does not exist and the incoming quantity is positive, the item is added.
   */
  upsertItem(item: Omit<InventoryItem, 'quantity'> & { quantity: number }) {
    const existing = this.props.items.find(i => i.itemId === item.itemId);

    if (existing) {
      // Adjust quantity (positive => add, negative => reduce)
      existing.quantity += item.quantity;

      // Remove the item if quantity is now 0 or negative
      if (existing.quantity <= 0) {
        this.removeItem(item.itemId);
      }
      return;
    }

    // Only add new item if quantity is positive
    if (item.quantity > 0) {
      this.props.items.push(item);
    }
  }

  /** Remove an item completely */
  removeItem(itemId: string) {
    this.props.items = this.props.items.filter(i => i.itemId !== itemId);
  }
}
