import { IsString } from 'class-validator';

export class AddClearedStageDto {
  @IsString()
  stageId: string;
  @IsString()
  nextStageId: string;
}