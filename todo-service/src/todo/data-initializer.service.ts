import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './entities/status.entity';
import { StatusEnum, StatusTitles } from './enums/status.enum';

@Injectable()
export class DataInitializerService implements OnModuleInit {
  constructor(
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
  ) {}

  async onModuleInit() {
    await this.initializeStatuses();
  }

  private async initializeStatuses() {
    const statuses = Object.entries(StatusTitles).map(([id, title]) => ({
      id: parseInt(id),
      title,
    }));

    await this.statusRepository
      .createQueryBuilder()
      .insert()
      .into(Status)
      .values(statuses)
      .orUpdate(['title'], ['id'])
      .execute();
  }
}