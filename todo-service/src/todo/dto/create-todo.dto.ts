import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { StatusEnum } from '../enums/status.enum';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @IsNotEmpty()
  @IsString()
  userId: string;
}