import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async register(registerDto: RegisterDto) {
		const createdUser = await this.usersService.create(registerDto);
		const userObj = createdUser.toObject();
		delete userObj.password;
		return userObj;
	}

	async login(loginDto: LoginDto) {
		const { email, password } = loginDto;
		const user = await this.usersService.findOneByEmail(email);

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const payload = { sub: user._id.toString(), email: user.email, role: user.role };
		const accessToken = this.jwtService.sign(payload);

		const userObj = user.toObject();
		delete userObj.password;

		return {
			accessToken,
			user: userObj,
		};
	}
}
