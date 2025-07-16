import { IsInt, IsArray, ValidateNested, IsString, IsNumber, ArrayNotEmpty, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UnitPositionDto {
  @IsString()
  unitId: string;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}

export class UpdateUnitSetupDto {
  @IsInt()
  @Min(0)
  @Max(9)
  slotIndex: number; // which of the 10 squad slots to update

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UnitPositionDto)
  units: UnitPositionDto[];
}