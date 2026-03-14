import { NotFoundException } from '@nestjs/common';

import { LessonDataEntity } from 'src/categories/domain/entities/category.entity';
import { ChapterDraft } from 'src/draftGenerate/domain/entities/draft.entity';

import createMatrixConfig from './createMatrixConfig';
import { allocateQuestion } from './allocateQuesion';
import splitLevels from './splitLevel';

export type FlattenedLesson = LessonDataEntity & { chapterId: string };

export default function generateMatrixUtil(
  lessonsData: Record<string, LessonDataEntity[]>,
  newDraftContent: ChapterDraft[],
  questionTypes: string[],
  questionsCount: number,
) {
  const config: Record<string, number> = {};
  createMatrixConfig(questionTypes, questionsCount, config);

  const flattedLessons: FlattenedLesson[] = Object.entries(lessonsData).flatMap(
    ([chapterId, lessons]) =>
      lessons.map((lesson) => ({
        ...lesson,
        chapterId,
      })),
  );

  const totalBank: Record<string, number> = {};

  flattedLessons.forEach((lesson) => {
    Object.entries(lesson.questionTypes).forEach(([type, count]) => {
      totalBank[type] = (totalBank[type] || 0) + count;
    });
  });

  Object.entries(config).forEach(([type, totalQuestionToAllocate]) => {
    const totalBankForType = totalBank[type] || 0;

    const allocations = allocateQuestion(
      flattedLessons,
      type,
      totalBankForType,
      totalQuestionToAllocate,
    );

    allocations.forEach(({ lesson, finalShare }) => {
      if (finalShare === 0) return;

      const curChapterIndex = newDraftContent.findIndex(
        (chapter) => chapter.id === lesson.chapterId,
      );
      if (curChapterIndex < 0) return;

      const lessonDraft = newDraftContent[curChapterIndex].lessons.find(
        (l) => l.id === lesson.id,
      );

      if (!lessonDraft) {
        throw new NotFoundException(
          'Bài chưa tồn tại trong chương của bản nháp',
        );
      }

      const level = splitLevels(lesson.difficultyLevels, finalShare);

      lessonDraft.matrix[type] ??= {};

      Object.entries(level).forEach(([levelKey, count]) => {
        lessonDraft.matrix[type][levelKey] ??= 0;
        lessonDraft.matrix[type][levelKey] += count;
      });
    });
  });

  return newDraftContent;
}
