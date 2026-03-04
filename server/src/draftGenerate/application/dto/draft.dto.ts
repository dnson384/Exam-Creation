export interface CreateDraftDTO {
  questionsCount: number;
  questionTypes: string[];
}

export interface LessonDraftDTO {
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

export interface ChapterDraftDTO {
  id: string;
  name: string;
  lessons: { [lessonId: string]: LessonDraftDTO };
}

export class UpdateChapterParamPayloadDTO {
  id: string;
  name: string;
}

export interface UpdateChaptersDraftPayloadDTO {
  draftId: string;
  add: UpdateChapterParamPayloadDTO[];
  del: string[];
}
