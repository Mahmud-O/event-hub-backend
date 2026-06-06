import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/schemas/user.schema';

export class LoginResponseDto {
	@ApiProperty({
		description: 'The JSON Web Token (JWT) generated on successful authentication. The frontend must store this token and include it in the Authorization header as a Bearer token (i.e., `Authorization: Bearer <token>`) for all subsequent protected requests.',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmIxMmFhOTlk...',
	})
	accessToken!: string;

	@ApiProperty({
		description: 'The profile details of the authenticated user (excludes password).',
		type: User,
	})
	user!: User;
}
