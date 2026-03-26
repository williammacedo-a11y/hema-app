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
import { CreateAddressDTO } from './dto/create-address.dto';
import { UpdateAddressDTO } from './dto/update-address.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard)
  create(@Req() req: any, @Body() createAddressDto: CreateAddressDTO) {
    const userId = req.user.sub;
    return this.addressesService.createAddress(userId, createAddressDto);
  }

  @Get()
  @UseGuards(SupabaseAuthGuard)
  findAll(@Req() req: any) {
    const userId = req.user.sub;
    return this.addressesService.getMyAddresses(userId);
  }

  @Patch(':id')
  @UseGuards(SupabaseAuthGuard)
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDTO,
  ) {
    const userId = req.user.sub;
    return this.addressesService.updateAddress(userId, id, updateAddressDto);
  }

  @Delete(':id')
  @UseGuards(SupabaseAuthGuard)
  delete(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.addressesService.deleteAddress(userId, id);
  }

  @Get('cep/:cep')
  getCep(@Param('cep') cep: string) {
    return this.addressesService.getAddressByCep(cep);
  }
}
