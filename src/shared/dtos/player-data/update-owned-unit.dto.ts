import { IsString, IsNumber } from 'class-validator';

export class UpdateOwnedUnitDto {
  @IsString()
  unitId: string;

  @IsNumber()
  level: number;

  @IsNumber()
  currentExp: number;

  @IsNumber()
  tier: number;
}
