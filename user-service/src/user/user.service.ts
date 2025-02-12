import { ConflictException, Injectable, NotFoundException, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UserService implements OnModuleInit {
	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
		private configService: ConfigService
	) { }

	async onModuleInit() {
		const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
		const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

		if (adminEmail && adminPassword) {
			const existingAdmin = await this.userModel.findOne({ email: adminEmail });
			if (!existingAdmin) {
				await this.create({
					email: adminEmail,
					password: adminPassword,
					username: 'admin'
				});
				console.log('Admin user created');
			}
		}
	}

	async create(createUserDto: CreateUserDto): Promise<User> {
		try {
			const createdUser = new this.userModel(createUserDto);
			await createdUser.setPassword(createUserDto.password);

			return await createdUser.save();
		} catch (error) {
			if (error.name === 'MongoServerError' && error.code === 11000) {
				throw new ConflictException('Email already exists');
			}

			console.error('Error creating user', error);
			throw new InternalServerErrorException('Error creating user', error.message);
		}
	}

	async findAll(): Promise<User[]> {
		return await this.userModel.find().exec();
	}

	async findOne(id: string): Promise<User> {
		const user = await this.userModel.findById(id).exec();

		if (!user) {
			throw new NotFoundException(`User with ID "${id}" not found`);
		}

		return user;
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await this.userModel.findOne({ email }).exec();

		if (!user) {
			throw new NotFoundException(`User with email "${email}" not found`);
		}

		return user;
	}

	async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		const user = await this.userModel.findById(id);

		if (!user) {
			throw new NotFoundException(`User with ID "${id}" not found`);
		}

		Object.assign(user, updateUserDto);

		if (updateUserDto.password) {
			await user.setPassword(updateUserDto.password);
		}

		return await user.save();
	}

	async remove(id: string): Promise<User> {
		const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

		if (!deletedUser) {
			throw new NotFoundException(`User with ID "${id}" not found`);
		}

		return deletedUser;
	}
}