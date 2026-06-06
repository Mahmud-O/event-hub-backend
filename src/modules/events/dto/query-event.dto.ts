import { IsDate, IsMongoId, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryEventDto {
	@ApiPropertyOptional({
		description: 'Search string to filter events by title or description (case-insensitive)',
		example: 'Tech',
	})
	@IsString()
	@IsOptional()
	search?: string;

	@ApiPropertyOptional({
		description: 'Filter events by category ID',
		example: '60d5ec49f83c2c2d008b4567',
	})
	@IsMongoId()
	@IsOptional()
	categoryId?: string;

	@ApiPropertyOptional({
		description: 'Filter events by organizer ID',
		example: '60d5ec49f83c2c2d008b4568',
	})
	@IsMongoId()
	@IsOptional()
	organizerId?: string;

	@ApiPropertyOptional({
		description: 'Filter events with price greater than or equal to this value',
		example: 10,
	})
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	@IsOptional()
	minPrice?: number;

	@ApiPropertyOptional({
		description: 'Filter events with price less than or equal to this value',
		example: 100,
	})
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	@IsOptional()
	maxPrice?: number;

	@ApiPropertyOptional({
		description: 'Filter events starting on or after this date',
		example: '2026-08-15T00:00:00.000Z',
	})
	@Type(() => Date)
	@IsDate()
	@IsOptional()
	fromDate?: Date;

	@ApiPropertyOptional({
		description: 'Filter events starting on or before this date',
		example: '2026-08-30T23:59:59.000Z',
	})
	@Type(() => Date)
	@IsDate()
	@IsOptional()
	toDate?: Date;
}
