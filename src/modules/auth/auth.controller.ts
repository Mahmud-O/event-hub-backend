import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { User } from '../users/schemas/user.schema';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('register')
	@ApiOperation({
		summary: 'Register a new user account',
		description: 'Registers a new user in the database. The frontend should send a JSON request body containing the email, password, firstName, lastName, and optionally role and phoneNumber. Content-Type must be set to `application/json`. On successful registration, the client receives the created user profile (excluding the password).',
	})
	@ApiConsumes('application/json')
	@ApiResponse({
		status: 201,
		description: 'The user account has been successfully created. Returns the newly created user object (excluding the hashed password).',
		type: User,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad Request. The request body is missing required fields or has invalid formats (e.g., email format invalid or password shorter than 6 characters).',
	})
	@ApiResponse({
		status: 409,
		description: 'Conflict. A user with the provided email address already exists in the database.',
	})
	async register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@Public()
	@Post('login')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Authenticate user credentials',
		description: 'Verifies the user credentials and generates a JSON Web Token (JWT) on success. The frontend should send a JSON request body with the email and password. Upon successful authentication, the frontend must capture the returned `accessToken` and attach it to the `Authorization` header of all protected requests as `Bearer <token>`. Content-Type must be set to `application/json`.',
	})
	@ApiConsumes('application/json')
	@ApiResponse({
		status: 200,
		description: 'Authentication successful. Returns the bearer access token and the user profile details.',
		type: LoginResponseDto,
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized. The credentials provided (email or password) are incorrect or do not match.',
	})
	async login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}
}
