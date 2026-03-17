export interface ContentDTO {
  template: string;
  variables: {
    math: Record<string, string>;
    image: Record<string, string>;
  };
}

export interface QuestionDetailDTO {
  id: string;
  question: ContentDTO;
  options: ContentDTO[];
}

export interface ExamQuestionDTO {
  questionType: string;
  difficultyLevel: string;
  questions: QuestionDetailDTO[];
}

export interface ExamReponseDTO {
  id: string;
  groups: ExamQuestionDTO[];
}

export interface ExamExportPayloadDTO {
  questionType: string;
  questionIds: string[];
}
