import { DraftEntity, UpdateChaptersEntity } from '../entities/draft.entity';

export abstract class IDraftsRepository {
  abstract createDraft(draft: DraftEntity): Promise<string>;
  abstract getDraft(draftId: string): Promise<DraftEntity>;
  abstract updateChapters(payload: UpdateChaptersEntity): Promise<boolean>;
}
