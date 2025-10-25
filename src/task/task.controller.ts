import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskWithAdviceDto } from './dto/task-with-advice.dto';
import { TasksWithAdviceDto } from './dto/tasks-with-advice.dto';
// import { JwtAuthGuard } from '../auth/jwt.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../user/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth('JWT-auth')
@Controller('task')
// @UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new task',
    description:
      'Creates a new task with title, description, status, and due date',
  })
  @ApiResponse({
    status: 201,
    description: 'Task successfully created with motivational advice.',
    type: TaskWithAdviceDto,
    schema: {
      example: {
        task: {
          id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
          title: 'Complete project documentation',
          description:
            'Write comprehensive documentation for all API endpoints',
          status: 'PENDING',
          dueDate: 1761384635,
          createdAt: '2025-10-25T10:30:00.000Z',
          updatedAt: '2025-10-25T10:30:00.000Z',
          user: {
            id: 'user-uuid',
            email: 'user@example.com',
          },
        },
        motivationalAdvice: 'Believe in yourself and all that you are.',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'title should not be empty',
          'dueDate must be a positive number',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiBody({
    type: CreateTaskDto,
    description: 'Task creation data',
    schema: {
      example: {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for all API endpoints',
        status: 'PENDING',
        dueDate: 1761384635,
      },
    },
  })
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.taskService.createWithAdvice(createTaskDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all tasks',
    description: 'Retrieves all tasks belonging to the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks retrieved successfully with motivational advice.',
    type: TasksWithAdviceDto,
    schema: {
      example: {
        tasks: [
          {
            id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
            title: 'Complete project documentation',
            description:
              'Write comprehensive documentation for all API endpoints',
            status: 'IN_PROGRESS',
            dueDate: 1761384635,
            createdAt: '2025-10-25T10:30:00.000Z',
            updatedAt: '2025-10-25T14:20:00.000Z',
            user: {
              id: 'user-uuid',
              email: 'user@example.com',
            },
          },
          {
            id: 'b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7',
            title: 'Review code changes',
            description: 'Review pull request for task management features',
            status: 'COMPLETED',
            dueDate: 1760000000,
            createdAt: '2025-10-24T09:15:00.000Z',
            updatedAt: '2025-10-24T16:45:00.000Z',
            user: {
              id: 'user-uuid',
              email: 'user@example.com',
            },
          },
        ],
        motivationalAdvice:
          'Every task you complete is a step closer to your goals.',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  findAll(@GetUser() user: User) {
    return this.taskService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID with motivational advice' })
  @ApiParam({ name: 'id', type: 'string', description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully with motivational advice.',
    type: TaskWithAdviceDto,
    schema: {
      example: {
        task: {
          id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
          title: 'Complete project documentation',
          description:
            'Write comprehensive documentation for all API endpoints',
          status: 'IN_PROGRESS',
          dueDate: 1761384635,
          createdAt: '2025-10-25T10:30:00.000Z',
          updatedAt: '2025-10-25T14:20:00.000Z',
          user: {
            id: 'user-uuid',
            email: 'user@example.com',
          },
        },
        motivationalAdvice: 'Progress, not perfection, is what matters.',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.taskService.findOneWithAdvice(id, user);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update task by ID',
    description: 'Updates specific fields of a task by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Task unique identifier (UUID)',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  @ApiResponse({
    status: 200,
    description: 'Task successfully updated.',
    type: Task,
    schema: {
      example: {
        id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
        title: 'Complete project documentation - Updated',
        description: 'Write comprehensive documentation with examples',
        status: 'IN_PROGRESS',
        dueDate: 1762000000,
        createdAt: '2025-10-25T10:30:00.000Z',
        updatedAt: '2025-10-25T16:45:00.000Z',
        user: {
          id: 'user-uuid',
          email: 'user@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Task with ID a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBody({
    type: UpdateTaskDto,
    description: 'Fields to update (all optional)',
    schema: {
      example: {
        title: 'Updated task title',
        status: 'IN_PROGRESS',
        dueDate: 1762000000,
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ) {
    return this.taskService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.taskService.remove(id, user);
  }
}
