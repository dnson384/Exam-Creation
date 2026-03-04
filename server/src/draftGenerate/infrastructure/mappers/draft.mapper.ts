import {
  ChapterDraft,
  DraftEntity,
  LessonDraft,
} from 'src/draftGenerate/domain/entities/draft.entity';
import {
  DraftDocument,
  Drafts,
  LessonDraftSch,
  ChapterDraftSch,
} from '../schemas/draft.schema';
import { Types } from 'mongoose';

export class DraftMapper {
  static toDomain(raw: DraftDocument): DraftEntity {
    const rawContent = raw.toObject();
    let chaptersData: Record<string, ChapterDraft> = {};

    for (const [chapterId, chapterData] of rawContent.content) {
      let lessons = {};
      for (const [lesssonId, lessonData] of chapterData.lessons) {
      }
      chaptersData[chapterId] = {
        id: chapterData.id.toString(),
        name: chapterData.name,
        lessons: lessons,
      };
    }

    return {
      id: rawContent._id.toString(),
      questionsCount: rawContent.questionsCount,
      questionTypes: rawContent.questionTypes,
      content: chaptersData,
    };
  }

  static toSchema(entity: DraftEntity): Partial<Drafts> {
    const mapLessonsToSchema = (lessonsObj: {
      [lessonId: string]: LessonDraft;
    }) => {
      const lessonsMap = new Map<string, LessonDraftSch>();

      Object.entries(lessonsObj).forEach(([lessonId, lessonContent]) => {
        lessonsMap.set(lessonId, {
          id: new Types.ObjectId(lessonContent.id),
          name: lessonContent.name,
          matrix: lessonContent.matrix,
          matrixDetails: lessonContent.matrixDetails,
        });
      });

      return lessonsMap;
    };

    const contentMap = new Map<string, ChapterDraftSch>();

    if (entity.content) {
      Object.entries(entity.content).forEach(([chapterId, chapterContent]) => {
        contentMap.set(chapterId, {
          id: new Types.ObjectId(chapterContent.id),
          name: chapterContent.name,
          lessons: mapLessonsToSchema(chapterContent.lessons),
        });
      });
    }

    return {
      questionsCount: entity.questionsCount,
      questionTypes: entity.questionTypes,
      content: contentMap,
    };
  }
}
