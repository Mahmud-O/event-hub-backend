import { IsArray, IsInt, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ExtraItemDto {
	@ApiProperty({
		description: 'Name of the extra service or item',
		example: 'Vip Seat',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		description: 'Price of the extra service or item',
		example: 15.0,
		minimum: 0,
		required: true,
	})
	@IsNumber()
	@Min(0)
	price!: number;
}

export class CreateBookingDto {
	@ApiProperty({
		description: 'The event ID to book tickets for',
		example: '60d5ec49f83c2c2d008b4569',
		required: true,
	})
	@IsMongoId()
	@IsNotEmpty()
	eventId!: string;

	@ApiProperty({
		description: 'Number of tickets to book',
		example: 2,
		minimum: 1,
		required: true,
	})
	@IsInt()
	@Min(1)
	ticketQuantity!: number;

	@ApiPropertyOptional({
		description: 'Selected extra services or items',
		type: [ExtraItemDto],
	})
	@IsArray()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => ExtraItemDto)
	selectedExtras?: ExtraItemDto[];
}
