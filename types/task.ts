// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.0
//   protoc               v5.29.1
// source: proto/task.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "task";

export interface Task {
  id: string;
  title: string;
  desc: string;
  assignedBy: string;
  assignedTo: string;
  status: string;
  priority: string;
  dueDate: string;
  tags: string[];
  metadata: { [key: string]: string };
}

export interface Task_MetadataEntry {
  key: string;
  value: string;
}

export interface CreateTaskRequest {
  title: string;
  desc: string;
  assignedBy: string;
  assignedTo: string;
  priority: string;
  dueDate: string;
  tags: string[];
  metadata: { [key: string]: string };
}

export interface CreateTaskRequest_MetadataEntry {
  key: string;
  value: string;
}

export interface GetTaskByIdRequest {
  id: string;
}

export interface UpdateTaskRequest {
  id: string;
  title: string;
  desc: string;
  priority: string;
  status: string;
  dueDate: string;
  tags: string[];
  metadata: { [key: string]: string };
}

export interface UpdateTaskRequest_MetadataEntry {
  key: string;
  value: string;
}

export interface DeleteTaskRequest {
  id: string;
}

export interface GetTasksByAssigneeRequest {
  assignedTo: string;
}

export interface GetTasksByCreatorRequest {
  assignedBy: string;
}

export interface TaskResponse {
  task: Task | undefined;
}

export interface DeleteTaskResponse {
  message: string;
  success: boolean;
}

export interface TaskListResponse {
  tasks: Task[];
}

export const TASK_PACKAGE_NAME = "task";

export interface TaskServiceClient {
  createTask(request: CreateTaskRequest): Observable<TaskResponse>;

  getTaskById(request: GetTaskByIdRequest): Observable<TaskResponse>;

  updateTask(request: UpdateTaskRequest): Observable<TaskResponse>;

  deleteTask(request: DeleteTaskRequest): Observable<DeleteTaskResponse>;

  getTasksByAssignee(request: GetTasksByAssigneeRequest): Observable<TaskListResponse>;

  getTasksByCreator(request: GetTasksByCreatorRequest): Observable<TaskListResponse>;
}

export interface TaskServiceController {
  createTask(request: CreateTaskRequest): Promise<TaskResponse> | Observable<TaskResponse> | TaskResponse;

  getTaskById(request: GetTaskByIdRequest): Promise<TaskResponse> | Observable<TaskResponse> | TaskResponse;

  updateTask(request: UpdateTaskRequest): Promise<TaskResponse> | Observable<TaskResponse> | TaskResponse;

  deleteTask(
    request: DeleteTaskRequest,
  ): Promise<DeleteTaskResponse> | Observable<DeleteTaskResponse> | DeleteTaskResponse;

  getTasksByAssignee(
    request: GetTasksByAssigneeRequest,
  ): Promise<TaskListResponse> | Observable<TaskListResponse> | TaskListResponse;

  getTasksByCreator(
    request: GetTasksByCreatorRequest,
  ): Promise<TaskListResponse> | Observable<TaskListResponse> | TaskListResponse;
}

export function TaskServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createTask",
      "getTaskById",
      "updateTask",
      "deleteTask",
      "getTasksByAssignee",
      "getTasksByCreator",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("TaskService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("TaskService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const TASK_SERVICE_NAME = "TaskService";
