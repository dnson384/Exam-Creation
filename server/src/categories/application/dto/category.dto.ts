export interface BankStatDTO {
  exerciseType: string;
  difficultyLevels: string[];
  learningOutcomes: string[];
  questionType: string;
  count: number;
}

export interface newLessonDataDTO {
  name: string;
  bankStats: BankStatDTO[];
}

export interface NewCategoryDTO {
  subject: string;
  chapter: string;
  lessons: newLessonDataDTO[];
}

export interface LessonDataDTO {
  id: string;
  name: string;
  bankStats: BankStatDTO[];
}

export interface CategoriesResponseDTO {
  id: string;
  subject: string;
  chapter: string;
  lessons: LessonDataDTO[];
}
