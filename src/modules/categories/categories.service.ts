import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
	constructor(
		@InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
	) {}

	async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDocument> {
		const { name } = createCategoryDto;
		const existingCategory = await this.categoryModel
			.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
			.exec();
		if (existingCategory) {
			throw new ConflictException('Category with this name already exists');
		}

		const newCategory = new this.categoryModel(createCategoryDto);
		return newCategory.save();
	}

	async findAll(): Promise<CategoryDocument[]> {
		return this.categoryModel.find().exec();
	}

	async findById(id: string): Promise<CategoryDocument | null> {
		return this.categoryModel.findById(id).exec();
	}
}
