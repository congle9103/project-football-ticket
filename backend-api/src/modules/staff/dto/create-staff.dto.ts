import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateStaffDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
