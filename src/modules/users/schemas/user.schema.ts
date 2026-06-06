import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
	@ApiProperty({
		description: 'The unique email address of the user',
		example: 'user@example.com',
		required: true,
	})
	@Prop({ required: true, unique: true, lowercase: true, trim: true })
	email!: string;

	@ApiProperty({
		description: 'The hashed password of the user',
		example: '$2a$10$abcdefghijklmnopqrstuv',
		required: true,
	})
	@Prop({ required: true })
	password!: string;

	@ApiProperty({
		description: 'The role of the user inside the application',
		enum: ['User', 'Organizer', 'Admin'],
		default: 'User',
		required: true,
	})
	@Prop({ type: String, enum: ['User', 'Organizer', 'Admin'], default: 'User' })
	role!: string;

	@ApiProperty({
		description: 'The first name of the user',
		example: 'John',
		required: true,
	})
	@Prop({ required: true })
	firstName!: string;

	@ApiProperty({
		description: 'The last name of the user',
		example: 'Doe',
		required: true,
	})
	@Prop({ required: true })
	lastName!: string;

	@ApiProperty({
		description: 'The phone number of the user',
		example: '+1234567890',
		required: false,
	})
	@Prop({ required: false })
	phoneNumber?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
