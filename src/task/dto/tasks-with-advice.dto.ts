import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';

export class TasksWithAdviceDto {
  @ApiProperty({
    description: 'Array of tasks',
    type: [Task],
  })
  tasks: Task[];

  @ApiProperty({
    description: 'Motivational advice to encourage task completion',
    example: 'Every task you complete is a step closer to your goals.',
  })
  motivationalAdvice: string;
}
