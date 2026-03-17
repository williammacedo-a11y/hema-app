import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import type { CreateAddressDTO } from './dto/create-address.dto';
import type { UpdateAddressDTO } from './dto/update-address.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard)
  create(@Req() req: Request, @Body() createAddressDto: CreateAddressDTO) {
    const userId = req['user'].sub;
    return this.addressesService.createAddress(userId, createAddressDto);
  }

  @Get()
  @UseGuards(SupabaseAuthGuard)
  findAll(@Req() req: Request) {
    const userId = req['user'].sub;
    return this.addressesService.getMyAddresses(userId);
  }

  @Patch(':id')
  @UseGuards(SupabaseAuthGuard)
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDTO,
  ) {
    const userId = req['user'].sub;
    return this.addressesService.updateAddress(userId, id, updateAddressDto);
  }

  @Get('cep/:cep')
  getCep(@Param('cep') cep: string) {
    return this.addressesService.getAddressByCep(cep);
  }

  @Delete(':id')
  @UseGuards(SupabaseAuthGuard)
  delete(@Req() req: Request, @Param('id') id: string) {
    const userId = req['user'].sub;
    return this.addressesService.deleteAddress(userId, id);
  }
}
