import { ExamReponseDTO } from '../dto/exams.dto';

export class ExamMapper {
  static toDetailResponseDTO(rawExam: any): ExamReponseDTO {
    return {
      id: rawExam._id.toString(),
      groups: rawExam.questions.map((group: any) => ({
        questionType: group.questionType,
        difficultyLevel: group.difficultyLevel,
        questions: group.questionIds.map((q: any) => ({
          id: q._id.toString(),
          question: {
            template: q.question.template,
            variables: q.question.variables,
          },
          options: q.options.map((opt: any) => ({
            template: opt.template,
            variables: opt.variables,
          })),
        })),
      })),
    };
  }
}
