import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type InventoryDocument = Inventory & Document;

@Schema({ timestamps: true })
export class Inventory {
  @Prop({ required: true })
  accountId: string;

  @Prop({
    type: [
      {
        itemId: { type: String, required: true },
        quantity: { type: Number, required: true },
        expiredDate: { type: Date, required: false },
        isLimited: { type: Boolean, required: true },
      },
    ],
    default: [],
  })
  items: {
    itemId: string;
    quantity: number;
    expiredDate: Date | null;
    isLimited: boolean;
  }[];
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
