import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/schemas/category.schema';
import { User } from '../../users/schemas/user.schema';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
	@ApiProperty({
		description: 'The title of the event',
		example: 'Tech Conference 2026',
		required: true,
	})
	@Prop({ required: true, trim: true })
	title!: string;

	@ApiProperty({
		description: 'The description of the event',
		example: 'An annual conference highlighting the latest innovations in AI, Web3, and Web Development.',
		required: true,
	})
	@Prop({ required: true })
	description!: string;

	@ApiProperty({
		description: 'The date and time of the event',
		example: '2026-08-15T09:00:00.000Z',
		required: true,
	})
	@Prop({ required: true, type: Date })
	date!: Date;

	@ApiProperty({
		description: 'The location of the event',
		example: 'San Francisco, CA or Online',
		required: true,
	})
	@Prop({ required: true })
	location!: string;

	@ApiProperty({
		description: 'The category reference ID',
		example: '60d5ec49f83c2c2d008b4567',
		type: String,
		required: true,
	})
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
	categoryId!: Category | string;

	@ApiProperty({
		description: 'The organizer reference ID',
		example: '60d5ec49f83c2c2d008b4568',
		type: String,
		required: true,
	})
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
	organizerId!: User | string;

	@ApiProperty({
		description: 'Ticket price for the event',
		example: 49.99,
		minimum: 0,
		required: true,
	})
	@Prop({ required: true, min: 0 })
	price!: number;

	@ApiProperty({
		description: 'Maximum attendee capacity',
		example: 200,
		minimum: 1,
		required: true,
	})
	@Prop({ required: true, min: 1 })
	capacity!: number;
}

export const EventSchema = SchemaFactory.createForClass(Event);
