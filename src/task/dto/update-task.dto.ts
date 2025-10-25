import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    description: 'Updated title of the task',
    example: 'Complete project documentation - Updated',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'Updated description of the task',
    example: 'Write comprehensive documentation with examples',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Updated status of the task',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    required: false,
  })
  status?: TaskStatus;

  @ApiProperty({
    description: 'Updated due date as Unix timestamp',
    example: 1762000000,
    required: false,
  })
  dueDate?: number;
}
