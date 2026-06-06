import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
	@ApiProperty({
		description: 'The unique email address of the user. Must be a valid email format. Used as the main login identifier.',
		example: 'mahmoud.osama@digilians.com',
		required: true,
	})
	@IsEmail({}, { message: 'Please provide a valid email address' })
	@IsNotEmpty({ message: 'Email address is required' })
	email!: string;

	@ApiProperty({
		description: 'The user password. Must be at least 6 characters long to meet strength requirements.',
		example: 'SecurePass123!',
		minLength: 6,
		required: true,
	})
	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	@IsNotEmpty({ message: 'Password is required' })
	password!: string;

	@ApiPropertyOptional({
		description: 'The authorization role of the user inside the Event Hub platform, determining endpoint permissions.',
		enum: ['User', 'Organizer', 'Admin'],
		default: 'User',
	})
	@IsEnum(['User', 'Organizer', 'Admin'], { message: 'Role must be User, Organizer, or Admin' })
	@IsOptional()
	role?: string;

	@ApiProperty({
		description: 'The first name (given name) of the user.',
		example: 'Mahmoud',
		required: true,
	})
	@IsString()
	@IsNotEmpty({ message: 'First name is required' })
	firstName!: string;

	@ApiProperty({
		description: 'The last name (family name) of the user.',
		example: 'Osama',
		required: true,
	})
	@IsString()
	@IsNotEmpty({ message: 'Last name is required' })
	lastName!: string;

	@ApiPropertyOptional({
		description: 'An optional contact phone number for the user profile.',
		example: '+15550199',
	})
	@IsString()
	@IsOptional()
	phoneNumber?: string;
}
