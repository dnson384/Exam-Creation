import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { ImporterUseCase } from '../application/importer.usecase';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('importer')
export class ImporterController {
  constructor(private readonly importUseCase: ImporterUseCase) {}

  @Post('parse')
  @UseInterceptors(FileInterceptor('file'))
  async parseDocx(
    @UploadedFile() file: Express.Multer.File,
    @Body('subject') subject: string,
  ) {
    return await this.importUseCase.execute(file.buffer, subject);
  }
}
