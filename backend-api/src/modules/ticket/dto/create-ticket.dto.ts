import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';

class MatchIdDto {
  @IsNumber()
  id: number;
}

class UserIdDto {
  @IsNumber()
  id: number;
}

export class CreateTicketDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MatchIdDto)
  match: MatchIdDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UserIdDto)
  user: UserIdDto;

  @IsNotEmpty()
  @IsString()
  area: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
