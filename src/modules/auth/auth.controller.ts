import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('register')
	@ApiOperation({ summary: 'Register a new user account' })
	@ApiResponse({
		status: 201,
		description: 'User successfully registered.',
	})
	@ApiResponse({
		status: 400,
		description: 'Invalid input data.',
	})
	@ApiResponse({
		status: 409,
		description: 'Email address already in use.',
	})
	async register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@Public()
	@Post('login')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Authenticate user credentials' })
	@ApiResponse({
		status: 200,
		description: 'Successfully authenticated, returned JWT token.',
	})
	@ApiResponse({
		status: 401,
		description: 'Invalid credentials.',
	})
	async login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}
}
