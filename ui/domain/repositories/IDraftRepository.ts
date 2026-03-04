import {
  CreateDraftPayloadEntity,
  UpdateChaptersDraftPayloadEntity,
  DraftEntity,
} from "../entities/draft.entity";

export interface IDraftRepository {
  createDraft(payload: CreateDraftPayloadEntity): Promise<string>;
  getDraft(draftId: string): Promise<DraftEntity>;
  updateChapters(payload: UpdateChaptersDraftPayloadEntity): Promise<boolean>;
}
