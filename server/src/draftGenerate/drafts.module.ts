import { Module } from '@nestjs/common';
import { DraftController } from './presentation/draft.controller';
import { DraftsUsecase } from './application/draft.usecase';
import { IDraftsRepository } from './domain/repositories/draft.repository';
import { DraftsRepository } from './infrastructure/repositories/draft.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Drafts, DraftSchema } from './infrastructure/schemas/draft.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Drafts.name, schema: DraftSchema }]),
  ],
  controllers: [DraftController],
  providers: [
    DraftsUsecase,
    { provide: IDraftsRepository, useClass: DraftsRepository },
  ],
})
export class DraftModule {}
