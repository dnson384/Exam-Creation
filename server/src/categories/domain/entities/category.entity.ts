export class BankStatEntity {
  exerciseType: string;
  difficultyLevels: string[];
  learningOutcomes: string[];
  questionType: string;
  count: number;
}

export class LessonDataEntity {
  id?: string;
  name: string;
  bankStats: BankStatEntity[];

  constructor(props: Partial<LessonDataEntity>) {
    Object.assign(this, props);
    if (!this.bankStats) this.bankStats = [];
  }
}

export class CategoryEntity {
  id?: string;
  subject: string;
  chapter: string;
  lessons: LessonDataEntity[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: Partial<CategoryEntity>) {
    Object.assign(this, props);
    if (!this.lessons) this.lessons = [];
  }
}
