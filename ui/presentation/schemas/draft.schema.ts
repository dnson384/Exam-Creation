import { record, string, z } from "zod";

export const CreateDraftPayload = z.object({
  questionsCount: z.number().min(1, "Bắt buộc có ít nhất 1 câu hỏi"),
  questionTypes: z
    .array(z.string())
    .min(3, "Bắt buộc chọn ít nhất 3 dạng câu hỏi"),
});

// export const LessonDraftPayload = z.object({
//   id: z.string({ error: "Thiếu lessonId" }),
//   name: z.string({ error: "Thiếu lessonName" }),
//   matrix: z.record(
//     z.string({ error: "Thiếu loại câu hỏi" }),
//     z.record(
//       z.string({ error: "Thiếu mức độ khó" }),
//       z.number().min(1, "Số lượng câu hỏi phải từ 1"),
//     ),
//   ),
//   matrixDetails: z.record(
//     z.string({ error: "Thiếu mức độ khó" }),
//     z.record(
//       z.string({ error: "Thiếu yêu cầu cần đạt" }),
//       z.record(
//         z.string({ error: "Thiếu loại câu hỏi" }),
//         z.number().min(1, "Số lượng câu hỏi phải từ 1"),
//       ),
//     ),
//   ),
// });

// export const UpdateDraftPayload = z.object({
//   id: z.string({ error: "Thiếu draftId" }),
//   questionsCount: z.number().min(1, "Số lượng câu hỏi phải từ 1"),
//   questionsType: z
//     .array(z.string())
//     .min(3, "Bắt buộc chọn ít nhất 3 dạng câu hỏi"),
//   content: z.record(
//     z.string({ error: "Thiếu chapterId" }),
//     ChapterDraftPayload,
//   ),
// });

export const UpdateChapterDraftParam = z.object({
  id: z.string({ error: "Thiếu chapterId" }),
  name: z.string({ error: "Thiếu chapterName" }),
});

export const UpdateChaptersDraftPayload = z.object({
  draftId: z.string(),
  add: z.array(UpdateChapterDraftParam),
  del: z.array(z.string()),
});

export type CreateDraftPayload = z.infer<typeof CreateDraftPayload>;
// export type LessonDraftPayload = z.infer<typeof LessonDraftPayload>;
export type UpdateChapterDraftParam = z.infer<typeof UpdateChapterDraftParam>;
// export type UpdateDraftPayload = z.infer<typeof UpdateDraftPayload>;
export type UpdateChaptersDraftPayload = z.infer<
  typeof UpdateChaptersDraftPayload
>;
