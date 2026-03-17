import { Module } from '@nestjs/common';
import { ExporterController } from './presentation/exporter.controller';
import { ExporterService } from './application/services/exporter.service';

@Module({
  controllers: [ExporterController],
  providers: [ExporterService],
  exports: [ExporterService],
})
export class ExporterModule {}
