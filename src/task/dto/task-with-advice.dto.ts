import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';

export class TaskWithAdviceDto {
  @ApiProperty({
    description: 'The task data',
    type: () => Task,
  })
  task: Task;

  @ApiProperty({
    description: 'Motivational advice to encourage task completion',
    example: 'Believe in yourself and all that you are.',
  })
  motivationalAdvice: string;
}
