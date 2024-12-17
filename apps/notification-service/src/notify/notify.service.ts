import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Mongoose, Types } from 'mongoose';
import {
  CreateNotificationRequest,
  CreateNotificationResponse,
  DeleteNotificationRequest,
  DeleteNotificationResponse,
  GetNotificationsRequest,
  GetNotificationsResponse,
  MarkAllAsReadRequest,
  MarkAllAsReadResponse,
  UpdateNotificationRequest,
  UpdateNotificationResponse,
  Notification,
} from 'types/notify';
import { SseService } from '../sse/sse.service';

@Injectable()
export class NotifyService {
  constructor(
    @InjectModel('Notification')
    private notificationModel: Model<Notification>,
    private readonly sseService: SseService,
  ) {}

  async createNotification(
    request: CreateNotificationRequest,
  ): Promise<CreateNotificationResponse> {
    const readStatus = request.participants.reduce(
      (status, participant) => {
        status[participant] = false;
        return status;
      },
      {} as Record<string, boolean>,
    );

    const notification = new this.notificationModel({
      ...request,
      participants: request.participants.map((id) => new Types.ObjectId(id)),
      readStatus,
    });

    const createdNotification = await notification.save();

    this.sseService.broadcastToUsers(
      request.participants,
      createdNotification.toObject(),
    );

    return { notification: createdNotification.toObject() };
  }

  async deleteNotification(
    request: DeleteNotificationRequest,
  ): Promise<DeleteNotificationResponse> {
    await this.notificationModel.findByIdAndDelete(request.id);
    return { message: 'Notification deleted successfully', success: true };
  }

  async updateNotification(
    request: UpdateNotificationRequest,
  ): Promise<UpdateNotificationResponse> {
    const { id, title, desc, isRead, userId } = request;

    const notification = await this.notificationModel.findById(id);

    if (!notification) {
      throw new Error('Notification not found');
    }

    if (title) notification.title = title;
    if (desc) notification.desc = desc;

    if (isRead !== undefined && userId) {
      notification.readStatus = {
        ...notification.readStatus,
        [userId]: isRead,
      };
    }

    const updatedNotification = await notification.save();
    return { notification: updatedNotification.toObject() };
  }

  async markAllAsRead(
    request: MarkAllAsReadRequest,
  ): Promise<MarkAllAsReadResponse> {
    const { userId } = request;

    await this.notificationModel.updateMany(
      { participants: userId },
      { $set: { [`readStatus.${userId}`]: true } },
    );

    return { message: 'All notifications marked as read', success: true };
  }

  async getNotifications(
    request: GetNotificationsRequest,
  ): Promise<GetNotificationsResponse> {
    const { userId, cursor, limit = 10 } = request;

    const query: any = { participants: new Types.ObjectId(userId) };

    if (cursor) {
      query['_id'] = { $lt: new Types.ObjectId(cursor) };
    }

    const notifications = await this.notificationModel
      .find(query)
      .sort({ _id: -1 })
      .limit(limit);

    const nextCursor = notifications.length
      ? notifications[notifications.length - 1]._id.toString()
      : null;
    const hasMore = notifications.length === limit;

    return {
      notifications,
      nextCursor,
      hasMore,
    };
  }
}
