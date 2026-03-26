import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  Length,
} from 'class-validator';

export class CreateAddressDTO {
  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsNotEmpty({ message: 'A rua é obrigatória' })
  street: string;

  @IsString()
  @IsNotEmpty({ message: 'O número é obrigatório' })
  number: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsNotEmpty({ message: 'O bairro é obrigatório' })
  neighborhood: string;

  @IsString()
  @IsNotEmpty({ message: 'A cidade é obrigatória' })
  city: string;

  @IsString()
  @IsNotEmpty({ message: 'O estado é obrigatório' })
  @Length(2, 2, { message: 'O estado deve ter 2 letras (ex: SP, PR)' })
  state: string;

  @IsString()
  @IsNotEmpty({ message: 'O CEP é obrigatório' })
  zip_code: string;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}
