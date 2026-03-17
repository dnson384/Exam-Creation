import { QuestionEntity } from 'src/questions/domain/entities/question.entity';
import { ExamExportPayloadDTO } from '../dto/exams.dto';
import { ExamExportDataDTO } from 'src/exporter/application/dtos/exporter.dto';

export function convertExamDataForExport(
  payload: ExamExportPayloadDTO[],
  questions: QuestionEntity[],
): ExamExportDataDTO[] {
  const questionDictionary = new Map<string, any>();
  questions.forEach((q) => {
    questionDictionary.set(q.id!.toString(), {
      id: q.id,
      question: q.question,
      options: q.options,
    });
  });

  const exportData = payload.map((group) => {
    return {
      questionType: group.questionType,
      questions: group.questionIds
        .map((id) => questionDictionary.get(id))
        .filter((q) => q !== undefined),
    };
  });

  return exportData;
}
