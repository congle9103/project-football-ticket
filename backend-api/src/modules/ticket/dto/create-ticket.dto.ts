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
  cartId: number;
  paymentMethod: string;
}
