import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/schemas/user.schema';
import { Event } from '../../events/schemas/event.schema';

export type BookingDocument = Booking & Document;

@Schema({ _id: false })
export class ExtraItem {
	@ApiProperty({ description: 'Name of the extra service or item', example: 'Vip Seat' })
	@Prop({ required: true })
	name!: string;

	@ApiProperty({ description: 'Price of the extra service or item', example: 15.0 })
	@Prop({ required: true, min: 0 })
	price!: number;
}

const ExtraItemSchema = SchemaFactory.createForClass(ExtraItem);

@Schema({ timestamps: true })
export class Booking {
	@ApiProperty({
		description: 'The user reference ID who placed the booking',
		example: '60d5ec49f83c2c2d008b4568',
		type: String,
		required: true,
	})
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
	userId!: User | string;

	@ApiProperty({
		description: 'The event reference ID',
		example: '60d5ec49f83c2c2d008b4569',
		type: String,
		required: true,
	})
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
	eventId!: Event | string;

	@ApiProperty({
		description: 'Quantity of tickets booked',
		example: 2,
		minimum: 1,
		required: true,
	})
	@Prop({ required: true, min: 1 })
	ticketQuantity!: number;

	@ApiProperty({
		description: 'Selected extra services or items',
		type: [ExtraItem],
		required: false,
	})
	@Prop({ type: [ExtraItemSchema], default: [] })
	selectedExtras?: ExtraItem[];

	@ApiProperty({
		description: 'Total calculated price of the booking',
		example: 129.98,
		required: true,
	})
	@Prop({ required: true, min: 0 })
	totalPrice!: number;

	@ApiProperty({
		description: 'The status of the booking',
		enum: ['Pending', 'Confirmed', 'Cancelled'],
		default: 'Pending',
		required: true,
	})
	@Prop({ type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' })
	status!: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
