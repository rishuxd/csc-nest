import { Injectable, NotFoundException } from '@nestjs/common';
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
import { TaskServiceKafkaProducerService } from '../kafka/kafka-producer.service';
import { CmntService } from '../cmnt/cmnt.service';
import { Cmnt } from 'types/cmnt';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Task') private readonly taskModel: Model<Task>,
    @InjectModel('Cmnt') private readonly cmntModel: Model<Cmnt>,
    private readonly taskProducer: TaskServiceKafkaProducerService,
    private readonly cmntService: CmntService,
  ) {}

  async createTask(request: CreateTaskRequest): Promise<TaskResponse> {
    const createdTask = await this.taskModel.create(request);

    await this.cmntModel.create({
      taskId: createdTask._id.toString(),
      senderId: createdTask.assignedBy,
      cmntType: 1,
      contentType: 0,
      content: `Task '${createdTask.title}' created by ${createdTask.assignedBy}`,
      mediaUrl: '',
      replyTo: '',
      taggedUser: [],
    });

    this.taskProducer.emitEvent('task-created', createdTask).catch((err) => {
      console.error('Failed to emit task-created event:', err);
    });

    return { task: createdTask };
  }

  async deleteTask(request: DeleteTaskRequest): Promise<DeleteTaskResponse> {
    const task = await this.taskModel.findById(request.id).exec();

    if (!task) {
      throw new NotFoundException('Task not found!');
    }

    await this.taskModel.deleteOne({ _id: request.id }).exec();

    await this.cmntModel.deleteMany({ taskId: request.id }).exec();

    this.taskProducer.emitEvent('task-deleted', task).catch((err) => {
      console.error('Failed to emit task-deleted event:', err);
    });

    return {
      message: `Task '${task.title}' deleted successfully.`,
      success: true,
    };
  }

  async updateTask(request: UpdateTaskRequest): Promise<TaskResponse> {
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(request.id, request, { new: true })
      .exec();

    if (!updatedTask) {
      throw new NotFoundException('Task not found!');
    }

    this.cmntService.addCmnt({
      taskId: updatedTask._id.toString(),
      senderId: updatedTask.assignedBy,
      cmntType: 1,
      contentType: 0,
      content: `Task '${updatedTask.title}' updated by ${updatedTask.assignedBy}`,
      mediaUrl: '',
      replyTo: '',
      taggedUser: [],
    });

    return { task: updatedTask };
  }

  async getTaskById(request: GetTaskByIdRequest): Promise<TaskResponse> {
    const task = await this.taskModel.findById(request.id).exec();

    if (!task) {
      throw new NotFoundException('Task not found!');
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
