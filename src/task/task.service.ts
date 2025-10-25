import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';
import { User } from '../user/entities/user.entity';
import { AdviceService } from './advice.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private adviceService: AdviceService,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      status: createTaskDto.status || TaskStatus.PENDING,
      dueDate: createTaskDto.dueDate,
      user: user,
    });

    return await this.taskRepository.save(task);
  }

  async createWithAdvice(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<{ task: Task; motivationalAdvice: string }> {
    const task = await this.create(createTaskDto, user);
    const motivationalAdvice = await this.adviceService.getRandomAdvice();

    return {
      task: {
        ...task,
        user,
      },
      motivationalAdvice,
    };
  }

  async findAll(user: User): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async findOneWithAdvice(
    id: string,
    user: User,
  ): Promise<{ task: Task; motivationalAdvice: string }> {
    const task = await this.findOne(id, user);
    const motivationalAdvice = await this.adviceService.getRandomAdvice();

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return {
      task: {
        ...task,
        user,
      },
      motivationalAdvice,
    };
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.findOne(id, user);

    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
    }
    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }
    if (updateTaskDto.status !== undefined) {
      task.status = updateTaskDto.status;
    }
    if (updateTaskDto.dueDate !== undefined) {
      task.dueDate = updateTaskDto.dueDate;
    }

    return await this.taskRepository.save(task);
  }

  async remove(id: string, user: User): Promise<void> {
    const task = await this.findOne(id, user);
    await this.taskRepository.remove(task);
  }
}
