import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsString, IsNumber, IsBoolean, IsOptional, IsDate } from 'class-validator';

class InventoryItemDto {
  @IsString()
  itemId: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiredDate?: Date;

  @IsBoolean()
  isLimited: boolean;
}

export class AddInventoryItemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InventoryItemDto)
  items: InventoryItemDto[];
}
