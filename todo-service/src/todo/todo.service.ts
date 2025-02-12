import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { Status } from './entities/status.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { StatusEnum } from './enums/status.enum';

@Injectable()
export class TodoService {
	constructor(
		@InjectRepository(Todo)
		private todoRepository: Repository<Todo>,
		@InjectRepository(Status)
		private statusRepository: Repository<Status>,
	) { }

	async create(createTodoDto: CreateTodoDto): Promise<Todo> {
		const status = await this.statusRepository.findOne({ where: { id: createTodoDto.status } });
		if (!status) {
			throw new NotFoundException(`Status with id ${createTodoDto.status} not found`);
		}
		const todo = this.todoRepository.create({
			...createTodoDto,
			status,
		});
		return this.todoRepository.save(todo);
	}

	async findAll(userId: string): Promise<Todo[]> {
		return this.todoRepository.find({
			where: { userId },
			relations: ['status'],
			order: {
				createdAt: 'DESC'
			}
		});
	}

	async findTodosByStatus(status: StatusEnum): Promise<Todo[]> {
		return this.todoRepository.find({
			where: { status: { id: status } },
			relations: ['status'],
		});
	}

	async findOne(id: number): Promise<Todo> {
		const todo = await this.todoRepository.findOne({ where: { id }, relations: ['status'] });
		if (!todo) {
			throw new NotFoundException(`Todo with id ${id} not found`);
		}
		return todo;
	}

	async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
		const todo = await this.findOne(id);
		if (updateTodoDto.status) {
			const status = await this.statusRepository.findOne({ where: { id: updateTodoDto.status } });
			if (!status) {
				throw new NotFoundException(`Status with id ${updateTodoDto.status} not found`);
			}
			todo.status = status;
		}
		Object.assign(todo, updateTodoDto);
		return this.todoRepository.save(todo);
	}

	async remove(id: number): Promise<void> {
		const result = await this.todoRepository.delete(id);
		if (result.affected === 0) {
			throw new NotFoundException(`Todo with id ${id} not found`);
		}
	}
}