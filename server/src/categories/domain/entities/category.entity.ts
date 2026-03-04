export class LessonData {
  id?: string;
  name: string;
  exerciseTypes: string[];
  difficultyLevels: string[];
  learningOutcomes: string[];
  questionTypes: string[];
}

export class CategoryEntity {
  id?: string;
  subject: string;
  chapter: string;
  lessons: LessonData[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: Partial<CategoryEntity>) {
    Object.assign(this, props);
    if (!this.lessons) this.lessons = [];
  }
}
