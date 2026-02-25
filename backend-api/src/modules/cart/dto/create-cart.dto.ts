import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCartDto {
  @IsNumber()
  match_id: number;

  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  area: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
