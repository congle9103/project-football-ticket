import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMatchDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  away_team: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  image_away_team: string;

  @IsNotEmpty()
  @IsString()
  time: string;

  @IsNotEmpty()
  @IsString()
  stadium: string;

  @IsNotEmpty()
  @IsString()
  round: string;

  @IsNotEmpty()
  @IsString()
  season: string;
}
