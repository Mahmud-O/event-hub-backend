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
	@ApiOperation({ summary: 'Get current user profile' })
	@ApiResponse({
		status: 200,
		description: 'Successfully retrieved user profile.',
		type: User,
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized.',
	})
	@ApiResponse({
		status: 404,
		description: 'User not found.',
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
