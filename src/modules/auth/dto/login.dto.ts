import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
	@ApiProperty({
		description: 'The registered email address used to log into the application.',
		example: 'mahmoud.osama@digilians.com',
		required: true,
	})
	@IsEmail({}, { message: 'Please provide a valid email address' })
	@IsNotEmpty({ message: 'Email address is required' })
	email!: string;

	@ApiProperty({
		description: 'The user password corresponding to the email address.',
		example: 'SecurePass123!',
		required: true,
	})
	@IsString()
	@IsNotEmpty({ message: 'Password is required' })
	password!: string;
}
