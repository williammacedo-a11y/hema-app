import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressDTO } from './create-address.dto';

export class UpdateAddressDTO extends PartialType(CreateAddressDTO) {
  label?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  is_default?: boolean;
}
