import { ChapterDraft } from 'src/draftGenerate/domain/entities/draft.entity';

export default function matrixQuestionsCount(chapterData: ChapterDraft[]) {
  const totalQuestions = chapterData.reduce((totalCount, chapter) => {
    const lessons = chapter.lessons;
    const questionsCount = Object.values(lessons).reduce((count, lesson) => {
      const matrix = lesson.matrix;
      if (!matrix) return count;

      const lessonTotal = Object.values(matrix).reduce(
        (matrixSum, matrixData) =>
          matrixSum +
          Object.values(matrixData).reduce(
            (levelSum, levelCount) => levelSum + levelCount,
            0,
          ),
        0,
      );

      return count + lessonTotal;
    }, 0);

    return totalCount + questionsCount;
  }, 0);

  return totalQuestions;
}
