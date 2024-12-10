import { Controller } from '@nestjs/common';
import { TaskService } from './task.service';
import {
  CreateTaskRequest,
  DeleteTaskRequest,
  DeleteTaskResponse,
  GetTaskByIdRequest,
  GetTasksByAssigneeRequest,
  GetTasksByCreatorRequest,
  TaskListResponse,
  TaskResponse,
  TaskServiceController,
  TaskServiceControllerMethods,
  UpdateTaskRequest,
} from 'types/task';

@Controller()
@TaskServiceControllerMethods()
export class TaskController implements TaskServiceController {
  constructor(private readonly taskService: TaskService) {}

  createTask(request: CreateTaskRequest): Promise<TaskResponse> {
    return this.taskService.createTask(request);
  }

  deleteTask(request: DeleteTaskRequest): Promise<DeleteTaskResponse> {
    return this.taskService.deleteTask(request);
  }

  updateTask(request: UpdateTaskRequest): Promise<TaskResponse> {
    return this.taskService.updateTask(request);
  }

  getTaskById(request: GetTaskByIdRequest): Promise<TaskResponse> {
    return this.taskService.getTaskById(request);
  }

  getTasksByAssignee(
    request: GetTasksByAssigneeRequest,
  ): Promise<TaskListResponse> {
    return this.taskService.getTasksByAssignee(request);
  }

  getTasksByCreator(
    request: GetTasksByCreatorRequest,
  ): Promise<TaskListResponse> {
    return this.taskService.getTasksByCreator(request);
  }
}
