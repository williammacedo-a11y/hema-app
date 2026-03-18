import { Injectable } from '@nestjs/common';
import { CreateAddressDTO } from './dto/create-address.dto';
import { UpdateAddressDTO } from './dto/update-address.dto';
import { supabase } from 'src/lib/supabase';

@Injectable()
export class AddressesService {
  async createAddress(userId: string, data: CreateAddressDTO) {
    if (data.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data: address, error } = await supabase
      .from('addresses')
      .insert({
        ...data,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      throw new Error('Erro ao criar endereço: ' + error.message);
    }

    return address;
  }

  async getMyAddresses(userId: string) {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Erro ao buscar endereços: ' + error.message);
    }

    return data;
  }

  async updateAddress(
    userId: string,
    addressId: string,
    data: UpdateAddressDTO,
  ) {
    if (data.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data: address, error } = await supabase
      .from('addresses')
      .update(data)
      .eq('id', addressId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error('Erro ao atualizar endereço: ' + error.message);
    }

    return address;
  }

  async getAddressByCep(cep: string) {
    const cleanCep = cep.replace(/\D/g, '');

    const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await res.json();

    if (data.erro) {
      throw new Error('CEP inválido');
    }

    return {
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
    };
  }

  async deleteAddress(userId: string, addressId: string) {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', userId);

    if (error) {
      throw new Error('Erro ao deletar endereço: ' + error.message);
    }
  }
}
