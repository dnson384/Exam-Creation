import { FlattenedLesson } from './generateMatrix';

export function allocateQuestion(
  flattenLessons: FlattenedLesson[],
  type: string,
  totalBankForType: number,
  totalQuestionToAllocate: number,
) {
  if (totalBankForType === 0) return [];

  const shares = flattenLessons.map((lesson) => {
    const lessonBank = lesson.questionTypes[type] || 0;
    const rawShare = (lessonBank / totalBankForType) * totalQuestionToAllocate;

    return {
      lesson,
      rawShare,
      floor: Math.floor(rawShare),
      remain: rawShare - Math.floor(rawShare),
    };
  });

  const allocatedTotal = shares.reduce((sum, item) => sum + item.floor, 0);
  const remainingToAllocate = totalQuestionToAllocate - allocatedTotal;

  shares.sort((a, b) => b.remain - a.remain);
  for (let i = 0; i < remainingToAllocate && i < shares.length; i++) {
    shares[i].floor += 1;
  }

  return shares.map((share) => ({
    lesson: share.lesson,
    finalShare: share.floor,
  }));
}
