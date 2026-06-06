import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
	@ApiProperty({
		description: 'The unique name of the category',
		example: 'Music',
		required: true,
	})
	@Prop({ required: true, unique: true, trim: true })
	name!: string;

	@ApiProperty({
		description: 'The description of the category',
		example: 'Concerts, festivals, and music shows',
		required: true,
	})
	@Prop({ required: true })
	description!: string;

	@ApiProperty({
		description: 'Icon name or class for the category',
		example: 'music-note',
		required: false,
	})
	@Prop({ required: false })
	icon?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
