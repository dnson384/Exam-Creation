export class ContentDTO {
  template: string;
  variables: {
    math: Record<string, string>;
    image: Record<string, string>;
  };
}

export class QuestionDataDTO {
  id: string;
  questionType: string;
  question: ContentDTO;
  options: ContentDTO[];
}

export class WordPayloadDTO {
  title: string;
  questionsSorted: Record<string, QuestionDataDTO[]>;
}

// Exam Data
export class QuestionDetailDTO {
  id: string;
  question: ContentDTO;
  options: ContentDTO[];
}

export class ExamExportDataDTO {
  questionType: string;
  questions: QuestionDetailDTO[];
}
