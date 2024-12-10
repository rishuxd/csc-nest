import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateTaskRequest,
  DeleteTaskRequest,
  DeleteTaskResponse,
  GetTaskByIdRequest,
  GetTasksByAssigneeRequest,
  GetTasksByCreatorRequest,
  TaskListResponse,
  TaskResponse,
  UpdateTaskRequest,
  Task,
} from 'types/task';

@Injectable()
export class TaskService {
  constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {}

  async createTask(request: CreateTaskRequest): Promise<TaskResponse> {
    const createdTask = new this.taskModel(request);
    const savedTask = await createdTask.save();
    return { task: savedTask };
  }

  async deleteTask(request: DeleteTaskRequest): Promise<DeleteTaskResponse> {
    const result = await this.taskModel.findByIdAndDelete(request.id).exec();
    const message = result ? 'Task deleted successfully.' : 'Task not found!';
    return { message, success: !!result };
  }

  async updateTask(request: UpdateTaskRequest): Promise<TaskResponse> {
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(request.id, request, { new: true })
      .exec();

    if (!updatedTask) {
      throw new Error('Task not found!');
    }

    return { task: updatedTask };
  }

  async getTaskById(request: GetTaskByIdRequest): Promise<TaskResponse> {
    const task = await this.taskModel.findById(request.id).exec();

    if (!task) {
      throw new Error('Task not found!');
    }

    return { task };
  }

  async getTasksByAssignee(
    request: GetTasksByAssigneeRequest,
  ): Promise<TaskListResponse> {
    const tasks = await this.taskModel
      .find({ assignedTo: request.assignedTo })
      .exec();

    return { tasks };
  }

  async getTasksByCreator(
    request: GetTasksByCreatorRequest,
  ): Promise<TaskListResponse> {
    const tasks = await this.taskModel
      .find({ assignedBy: request.assignedBy })
      .exec();

    return { tasks };
  }
}
