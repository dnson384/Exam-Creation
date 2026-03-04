import { Injectable } from '@nestjs/common';
import { IDraftsRepository } from '../domain/repositories/draft.repository';
import { CreateDraftDTO, UpdateChaptersDraftPayloadDTO } from './dto/draft.dto';
import {
  DraftEntity,
  UpdateChaptersEntity,
} from '../domain/entities/draft.entity';

@Injectable()
export class DraftsUsecase {
  constructor(private readonly repo: IDraftsRepository) {}

  async createDraft(payload: CreateDraftDTO): Promise<string> {
    const payloadDomain = new DraftEntity({
      questionsCount: payload.questionsCount,
      questionTypes: payload.questionTypes,
    });

    return await this.repo.createDraft(payloadDomain);
  }

  async getDraft(draftId: string): Promise<DraftEntity> {
    return await this.repo.getDraft(draftId);
  }

  async updateChapters(
    payload: UpdateChaptersDraftPayloadDTO,
  ): Promise<boolean> {
    const payloadDomain: UpdateChaptersEntity = new UpdateChaptersEntity({
      draftId: payload.draftId,
      add: payload.add,
      del: payload.del,
    });

    return await this.repo.updateChapters(payloadDomain);
  }
}
