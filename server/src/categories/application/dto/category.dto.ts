export interface LessonDataDTO {
  name: string;
  exerciseTypes: string[];
  difficultyLevels: string[];
  learningOutcomes: string[];
  questionTypes: string[];
}

export interface NewCategoryDTO {
  subject: string;
  chapter: string;
  lessons: LessonDataDTO[];
}

export interface CategoriesResponseDTO {
  id: string;
  subject: string;
  chapter: string;
  lessons: LessonDataDTO[];
}
