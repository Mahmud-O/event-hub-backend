import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
	@ApiProperty({
		description: 'The email address of the user',
		example: 'user@example.com',
		required: true,
	})
	@IsEmail()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({
		description: 'The password (minimum 6 characters)',
		example: 'password123',
		required: true,
	})
	@IsString()
	@MinLength(6)
	@IsNotEmpty()
	password!: string;

	@ApiPropertyOptional({
		description: 'The role assigned to the user',
		enum: ['User', 'Organizer', 'Admin'],
		default: 'User',
	})
	@IsEnum(['User', 'Organizer', 'Admin'])
	@IsOptional()
	role?: string;

	@ApiProperty({
		description: 'The first name of the user',
		example: 'John',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	firstName!: string;

	@ApiProperty({
		description: 'The last name of the user',
		example: 'Doe',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	lastName!: string;

	@ApiPropertyOptional({
		description: 'The phone number of the user',
		example: '+1234567890',
	})
	@IsString()
	@IsOptional()
	phoneNumber?: string;
}
