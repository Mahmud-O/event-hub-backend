import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
	) {}

	async create(createUserDto: CreateUserDto): Promise<UserDocument> {
		const { email, password, ...rest } = createUserDto;
		const existingUser = await this.userModel.findOne({ email }).exec();
		if (existingUser) {
			throw new ConflictException('Email address already in use');
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new this.userModel({
			email,
			password: hashedPassword,
			...rest,
		});

		return newUser.save();
	}

	async findOneByEmail(email: string): Promise<UserDocument | null> {
		return this.userModel.findOne({ email }).exec();
	}

	async findById(id: string): Promise<UserDocument | null> {
		return this.userModel.findById(id).exec();
	}

	async updateProfile(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
		const updates: Partial<User> = { ...updateUserDto };
		if (updateUserDto.password) {
			const salt = await bcrypt.genSalt(10);
			updates.password = await bcrypt.hash(updateUserDto.password, salt);
		}

		const updatedUser = await this.userModel
			.findByIdAndUpdate(id, { $set: updates }, { new: true })
			.exec();

		if (!updatedUser) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		return updatedUser;
	}
}
