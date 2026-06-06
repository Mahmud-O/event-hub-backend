import { IsDate, IsInt, IsMongoId, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
	@ApiProperty({
		description: 'The title of the event',
		example: 'Tech Conference 2026',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	title!: string;

	@ApiProperty({
		description: 'The description of the event',
		example: 'An annual conference highlighting the latest innovations in AI, Web3, and Web Development.',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	description!: string;

	@ApiProperty({
		description: 'The date and time of the event',
		example: '2026-08-15T09:00:00.000Z',
		required: true,
	})
	@Type(() => Date)
	@IsDate()
	date!: Date;

	@ApiProperty({
		description: 'The location of the event',
		example: 'San Francisco, CA or Online',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	location!: string;

	@ApiProperty({
		description: 'The category reference ID',
		example: '60d5ec49f83c2c2d008b4567',
		required: true,
	})
	@IsMongoId()
	categoryId!: string;

	@ApiProperty({
		description: 'Ticket price for the event',
		example: 49.99,
		minimum: 0,
		required: true,
	})
	@IsNumber()
	@Min(0)
	price!: number;

	@ApiProperty({
		description: 'Maximum attendee capacity',
		example: 200,
		minimum: 1,
		required: true,
	})
	@IsInt()
	@Min(1)
	capacity!: number;
}
