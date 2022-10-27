import { model, Model, Schema } from 'mongoose';
import { MODELS } from '../../utils/constants';
import ICategory from '../interfaces/ICategory';
const CategorySchema = new Schema(
   {
      category_name: { type: String, required: true, nullable: false },
   },
   {
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   }
);

CategorySchema.index({ category_name: 'text' });

const CategoryModel: Model<ICategory> = model<ICategory>(
   MODELS.category,
   CategorySchema,
   MODELS.category
);

export default CategoryModel;
