import { Categories, CategoriesDocument } from '../schemas/category.schemas';
import { CategoryEntity } from 'src/categories/domain/entities/category.entity';

export class CategoryMapper {
  static toDomain(raw: CategoriesDocument): CategoryEntity {
    return new CategoryEntity({
      id: raw._id.toString(),
      subject: raw.subject,
      chapter: raw.chapter,
      lessons: raw.lessons,
    });
  }

  static toSchema(entity: CategoryEntity): Partial<Categories> {
    return {
      subject: entity.subject,
      chapter: entity.chapter,
      lessons: entity.lessons,
    };
  }
}
