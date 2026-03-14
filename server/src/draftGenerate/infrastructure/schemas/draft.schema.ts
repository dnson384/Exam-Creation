import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type DraftDocument = HydratedDocument<Drafts>;

@Schema({ _id: false, minimize: false })
export class LessonDraftSch {
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
  })
  id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Object, default: {} })
  matrix: Record<string, Record<string, number>>;

  @Prop({ type: Object, default: {} })
  matrixDetails: Record<string, Record<string, Record<string, number>>>;
}
const LessonDraftSchema = SchemaFactory.createForClass(LessonDraftSch);

@Schema({ _id: false })
export class ChapterDraftSch {
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
  })
  id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [LessonDraftSchema], default: {} })
  lessons: LessonDraftSch[];
}
const ChapterDraftSchema = SchemaFactory.createForClass(ChapterDraftSch);

@Schema({ collection: 'Draft', timestamps: true })
export class Drafts {
  @Prop({ required: true })
  questionsCount: number;

  @Prop({ type: [String], required: true })
  questionTypes: string[];

  @Prop({ type: [ChapterDraftSchema], default: [] })
  chapters: ChapterDraftSch[];
}
export const DraftSchema = SchemaFactory.createForClass(Drafts);
