import { IsString } from 'class-validator';

export class AddClearedChapterDto {
  @IsString()
  chapterId: string;
}