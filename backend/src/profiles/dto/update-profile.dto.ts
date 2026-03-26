import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  cpf?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'A nova senha deve ter no mínimo 6 caracteres' })
  password?: string;

  @IsOptional()
  settings?: any;

  @IsString()
  @IsOptional()
  avatar_url?: string;
}

export class SupportTicketDto {
  @IsString()
  @IsNotEmpty({ message: 'O assunto é obrigatório' })
  @MaxLength(100, { message: 'O assunto é muito longo' })
  subject: string;

  @IsString()
  @IsNotEmpty({ message: 'A mensagem não pode estar vazia' })
  message: string;
}
