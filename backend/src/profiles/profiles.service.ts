import { Injectable, HttpException } from '@nestjs/common';

@Injectable()
export class ProfileService {
  private supabaseUrl = process.env.SUPABASE_URL as string;
  private supabaseKey = process.env.SUPABASE_ANON_KEY as string;

  async updateProfile(userId: string, data: any) {
    const url = `${this.supabaseUrl}/rest/v1/profiles?id=eq.${userId}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok)
      throw new HttpException('Erro ao atualizar perfil', response.status);
    return { message: 'Perfil atualizado com sucesso' };
  }

  async deleteProfile(userId: string) {
    const url = `${this.supabaseUrl}/rest/v1/profiles?id=eq.${userId}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
      },
    });

    if (!response.ok)
      throw new HttpException('Erro ao deletar perfil', response.status);
    return { message: 'Perfil deletado com sucesso' };
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const fileName = `${userId}-${Date.now()}-${file.originalname}`;
    const uploadUrl = `${this.supabaseUrl}/storage/v1/object/avatars/${fileName}`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
        'Content-Type': file.mimetype,
      },
      body: JSON.stringify(file.buffer),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new HttpException(
        `Erro no upload: ${error.message}`,
        response.status,
      );
    }

    const publicUrl = `${this.supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;

    await this.updateProfile(userId, { avatar_url: publicUrl });

    return { avatar_url: publicUrl };
  }
}
