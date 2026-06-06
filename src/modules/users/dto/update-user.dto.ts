import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
	@ApiPropertyOptional({
		description: 'The email address of the user',
		example: 'mahmoud.osama@digilians.com',
	})
	@IsEmail()
	@IsOptional()
	email?: string;

	@ApiPropertyOptional({
		description: 'The password of the user (minimum 6 characters)',
		example: 'newpassword123',
	})
	@IsString()
	@MinLength(6)
	@IsOptional()
	password?: string;

	@ApiPropertyOptional({
		description: 'The role assigned to the user',
		enum: ['User', 'Organizer', 'Admin'],
	})
	@IsEnum(['User', 'Organizer', 'Admin'])
	@IsOptional()
	role?: string;

	@ApiPropertyOptional({
		description: 'The first name of the user',
		example: 'Mahmoud',
	})
	@IsString()
	@IsOptional()
	firstName?: string;

	@ApiPropertyOptional({
		description: 'The last name of the user',
		example: 'Osama',
	})
	@IsString()
	@IsOptional()
	lastName?: string;

	@ApiPropertyOptional({
		description: 'The phone number of the user',
		example: '+1234567890',
	})
	@IsString()
	@IsOptional()
	phoneNumber?: string;
}
