import { ExamReponseDTO } from 'src/exams/application/dto/exams.dto';
import { ExamEntity } from '../entities/exam.entity';

export abstract class IExamsRepository {
  abstract saveExam(payload: ExamEntity): Promise<string>;
  abstract getExamById(examId: string): Promise<any>;
}
