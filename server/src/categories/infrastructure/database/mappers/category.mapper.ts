import { Types } from 'mongoose';
import { Categories, CategoriesDocument } from '../schemas/category.schemas';
import {
  CategoryEntity,
  LessonDataEntity,
} from 'src/categories/domain/entities/category.entity';

export class CategoryMapper {
  static toDomain(raw: CategoriesDocument): CategoryEntity {
    return new CategoryEntity({
      id: raw._id.toString(),
      subject: raw.subject,
      chapter: raw.chapter,
      lessons: raw.lessons.map(
        (lesson) =>
          new LessonDataEntity({
            id: lesson._id.toString(),
            name: lesson.name,
            bankStats: lesson.bankStats,
          }),
      ),
    });
  }

  static toSchema(entity: CategoryEntity): Partial<Categories> {
    return {
      subject: entity.subject,
      chapter: entity.chapter,
      lessons: entity.lessons.map((lesson) => ({
        _id: lesson.id ? new Types.ObjectId(lesson.id) : new Types.ObjectId(),
        name: lesson.name,
        bankStats: lesson.bankStats,
      })),
    };
  }
}
