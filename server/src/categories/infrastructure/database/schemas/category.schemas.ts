import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoriesDocument = HydratedDocument<Categories>;

@Schema({ _id: false })
export class BankStatSch {
  @Prop({ type: String, required: true })
  exerciseType: string;

  @Prop({ type: [String], required: true })
  difficultyLevels: string[];

  @Prop({ type: [String], required: true })
  learningOutcomes: string[];

  @Prop({ type: String, required: true })
  questionType: string;

  @Prop({ type: Number, required: true, default: 0 })
  count: number;
}
const BankStatSchema = SchemaFactory.createForClass(BankStatSch);

@Schema({ _id: true })
export class LessonDataSch {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [BankStatSchema], default: [] })
  bankStats: BankStatSch[];
}
const LessonDataSchema = SchemaFactory.createForClass(LessonDataSch);

@Schema({ collection: 'Categories', timestamps: true })
export class Categories {
  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  chapter: string;

  @Prop({ type: [LessonDataSchema], default: [], required: true })
  lessons: LessonDataSch[];
}
export const CategoriesSchema = SchemaFactory.createForClass(Categories);
