import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReqUser } from '../../common/decorators/user.decorator';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('profile')
	@ApiOperation({
		summary: 'Get current user profile',
		description: 'Retrieves the profile information of the currently authenticated user. The frontend must send the JWT token in the `Authorization` header formatted as `Bearer <token>`. Returns user details including email, first name, last name, and role, while hiding the hashed password.',
	})
	@ApiResponse({
		status: 200,
		description: 'Successfully retrieved user profile details. Returns the user object (excluding the hashed password).',
		type: User,
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized. The frontend did not provide a valid bearer token in the Authorization header or the token has expired.',
	})
	@ApiResponse({
		status: 404,
		description: 'User profile not found. The user represented by the token could not be found in the database.',
	})
	async getProfile(@ReqUser() user: any) {
		const foundUser = await this.usersService.findById(user.userId);
		if (!foundUser) {
			throw new NotFoundException('User profile not found');
		}
		const userObj = foundUser.toObject();
		delete userObj.password;
		return userObj;
	}
}
