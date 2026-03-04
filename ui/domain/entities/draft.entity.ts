export interface CreateDraftPayloadEntity {
  questionsCount: number;
  questionTypes: string[];
}

export interface LessonDraft {
  id: string;
  name: string;
  matrix: { [questionType: string]: { [level: string]: number } };
  matrixDetails: {
    [level: string]: {
      [outcome: string]: {
        [questionType: string]: number;
      };
    };
  };
}

export interface ChapterDraft {
  id: string;
  name: string;
  lessons: { [lessonId: string]: LessonDraft };
}

export interface DraftEntity {
  id: string;
  questionsCount: number;
  questionTypes: string[];
  content: {
    [chapterId: string]: ChapterDraft;
  };
  createAt?: Date;
  expiredAt?: Date;
}

export interface UpdateChaptersDraftPayloadEntity {
  draftId: string;
  add: Array<string>;
  del: Array<string>;
}
