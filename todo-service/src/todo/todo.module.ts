import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { DataInitializerService } from './data-initializer.service';
import { Todo } from './entities/todo.entity';
import { Status } from './entities/status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Todo, Status]),
    HttpModule,
  ],
  controllers: [TodoController],
  providers: [TodoService, DataInitializerService],
})
export class TodoModule {}
