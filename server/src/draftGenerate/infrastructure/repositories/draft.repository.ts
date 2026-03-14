import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IDraftsRepository } from 'src/draftGenerate/domain/repositories/draft.repository';
import { DraftDocument, Drafts } from '../schemas/draft.schema';
import { Model, Types } from 'mongoose';
import {
  DraftEntity,
  UpdateChaptersEntity,
  UpdateLessonsEntity,
  UpdateMatrixEntity,
} from 'src/draftGenerate/domain/entities/draft.entity';
import { DraftMapper } from '../mappers/draft.mapper';

@Injectable()
export class DraftsRepository implements IDraftsRepository {
  constructor(
    @InjectModel(Drafts.name) private readonly draftModel: Model<DraftDocument>,
  ) {}

  async createDraft(draft: DraftEntity): Promise<string> {
    const draftSchema: Partial<Drafts> = DraftMapper.toSchema(draft);
    const result = await this.draftModel.create(draftSchema);
    return result.id.toString();
  }

  async getDraft(draftId: string): Promise<DraftEntity> {
    const draft = await this.draftModel.findById(draftId);

    if (!draft) throw new NotFoundException('Bản nháp không tồn tại');

    const draftDomain = DraftMapper.toDomain(draft);

    return draftDomain;
  }

  async updateChapters(payload: UpdateChaptersEntity): Promise<boolean> {
    const draft = await this.getDraft(payload.draftId);

    if (!draft) throw new NotFoundException('Bản nháp không tồn tại');

    const chapterIds = draft.chapters.map((chapter) => chapter.id);

    const updateQuery: Record<string, any> = {};

    // Thêm
    if (payload.add && payload.add.length > 0) {
      const chaptersToAdd = payload.add.map((chapter) => {
        if (chapterIds.includes(chapter.id)) return;
        return {
          id: new Types.ObjectId(chapter.id),
          name: chapter.name,
          lessons: [],
        };
      });

      updateQuery['$push'] = {
        chapters: { $each: chaptersToAdd },
      };
    }

    // Xoá
    if (payload.del && payload.del.length > 0) {
      updateQuery['$pull'] = {
        chpaters: {
          id: { $in: payload.del.map((id) => new Types.ObjectId(id)) },
        },
      };
    }

    if (!updateQuery.$push && !updateQuery.$pull) {
      return false;
    }

    const result = await this.draftModel.updateOne(
      { _id: payload.draftId },
      updateQuery,
    );

    return result.modifiedCount > 0;
  }

  async updateLessons(payload: UpdateLessonsEntity): Promise<boolean> {
    const draft = await this.getDraft(payload.draftId);

    if (!draft) throw new NotFoundException('Bản nháp không tồn tại');

    const curChapter = draft.chapters.find(
      (chapter) => chapter.id === payload.chapterId,
    );
    if (!curChapter)
      throw new NotFoundException('Chương không tồn tại trong bản nháp');

    const curLessonIds = curChapter.lessons.map((lesson) => lesson.id);

    const updateQuery: Record<string, any> = {};

    // Thêm
    if (payload.add && payload.add.length > 0) {
      const lessonsToAdd = payload.add.map((lesson) => {
        if (curLessonIds.includes(lesson.id)) return;
        return {
          id: new Types.ObjectId(lesson.id),
          name: lesson.name,
          matrix: {},
          matrixDetails: {},
        };
      });

      updateQuery['$push'] = {
        'chapters.$.lessons': { $each: lessonsToAdd },
      };
    }

    // Xoá
    if (payload.del && payload.del.length > 0) {
      updateQuery['$pull'] = {
        'chapters.$.lessons': {
          id: { $in: payload.del.map((id) => new Types.ObjectId(id)) },
        },
      };
    }

    if (!updateQuery.$push && !updateQuery.$pull) {
      return false;
    }

    const result = await this.draftModel.updateOne(
      {
        _id: payload.draftId,
        'chapters.id': new Types.ObjectId(payload.chapterId),
      },
      updateQuery,
    );

    return result.modifiedCount > 0;
  }

  async updateMatrix(payload: UpdateMatrixEntity[]): Promise<boolean> {
    const query = payload.map((item) => ({
      updateOne: {
        filter: {
          _id: new Types.ObjectId(item.draftId),
        },
        update: {
          $set: {
            [`content.${item.chapterId}.lessons.${item.lessonId}.matrix`]:
              item.matrix,
          },
        },
      },
    }));

    await this.draftModel.bulkWrite(query);
    return true;
  }
}
