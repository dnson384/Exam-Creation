import { Injectable } from '@nestjs/common';
import {
  BankStatDTO,
  CategoriesResponseDTO,
  LessonDataDTO,
} from './dto/category.dto';
import { ICategoriesRepository } from '../domain/repositories/category.repository';

@Injectable()
export class CategoriesUseCase {
  constructor(private readonly repo: ICategoriesRepository) {}

  async getAll(): Promise<CategoriesResponseDTO[]> {
    const categoriesDomain = await this.repo.getAll();
    const categoriesDTO: CategoriesResponseDTO[] = categoriesDomain.map(
      (category) => ({
        id: category.id!,
        subject: category.subject,
        chapter: category.chapter,
        lessons: category.lessons.map(
          (lesson): LessonDataDTO => ({
            id: lesson.id!,
            name: lesson.name,
            bankStats: lesson.bankStats.map(
              (stat): BankStatDTO => ({
                exerciseType: stat.exerciseType,
                difficultyLevels: stat.difficultyLevels,
                learningOutcomes: stat.learningOutcomes,
                questionType: stat.questionType,
                count: stat.count,
              }),
            ),
          }),
        ),
      }),
    );
    return categoriesDTO;
  }
}
