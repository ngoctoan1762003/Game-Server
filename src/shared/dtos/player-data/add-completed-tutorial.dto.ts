import { IsString } from 'class-validator';

export class AddCompletedTutorialDto {
  @IsString()
  tutorialId: string;
}
