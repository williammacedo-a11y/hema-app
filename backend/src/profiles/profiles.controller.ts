import {
  Controller,
  Patch,
  Delete,
  Post,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profiles.service';
import { HttpException, HttpStatus } from '@nestjs/common';

export class UpdateProfileDto {
  name?: string;
  phone?: string;
}

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Patch(':id')
  async updateProfile(@Param('id') id: string, @Body() body: UpdateProfileDto) {
    return this.profileService.updateProfile(id, body);
  }

  @Delete(':id')
  async deleteProfile(@Param('id') id: string) {
    return this.profileService.deleteProfile(id);
  }

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('Nenhum arquivo enviado', HttpStatus.BAD_REQUEST);
    }

    return this.profileService.uploadAvatar(id, file);
  }
}
