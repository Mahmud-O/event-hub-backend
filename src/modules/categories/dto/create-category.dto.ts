import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
	@ApiProperty({
		description: 'The unique name of the category',
		example: 'Music',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		description: 'The description of the category',
		example: 'Concerts, festivals, and music shows',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	description!: string;

	@ApiProperty({
		description: 'Icon name or class for the category',
		example: 'music-note',
		required: false,
	})
	@IsString()
	@IsOptional()
	icon?: string;
}
