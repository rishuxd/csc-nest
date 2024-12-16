import { Controller } from '@nestjs/common';
import { NotifyService } from './notify.service';
import {
  CreateNotificationRequest,
  CreateNotificationResponse,
  DeleteNotificationRequest,
  DeleteNotificationResponse,
  GetNotificationsRequest,
  GetNotificationsResponse,
  MarkAllAsReadRequest,
  MarkAllAsReadResponse,
  NotifyServiceController,
  NotifyServiceControllerMethods,
  UpdateNotificationRequest,
  UpdateNotificationResponse,
} from 'types/notify';
import { Observable } from 'rxjs';

@Controller()
@NotifyServiceControllerMethods()
export class NotifyController implements NotifyServiceController {
  constructor(private readonly notifyService: NotifyService) {}

  createNotification(
    request: CreateNotificationRequest,
  ):
    | Promise<CreateNotificationResponse>
    | Observable<CreateNotificationResponse>
    | CreateNotificationResponse {
    return this.notifyService.createNotification(request);
  }

  deleteNotification(
    request: DeleteNotificationRequest,
  ):
    | Promise<DeleteNotificationResponse>
    | Observable<DeleteNotificationResponse>
    | DeleteNotificationResponse {
    return this.notifyService.deleteNotification(request);
  }

  updateNotification(
    request: UpdateNotificationRequest,
  ):
    | Promise<UpdateNotificationResponse>
    | Observable<UpdateNotificationResponse>
    | UpdateNotificationResponse {
    return this.notifyService.updateNotification(request);
  }

  markAllAsRead(
    request: MarkAllAsReadRequest,
  ):
    | Promise<MarkAllAsReadResponse>
    | Observable<MarkAllAsReadResponse>
    | MarkAllAsReadResponse {
    return this.notifyService.markAllAsRead(request);
  }

  getNotifications(
    request: GetNotificationsRequest,
  ):
    | Promise<GetNotificationsResponse>
    | Observable<GetNotificationsResponse>
    | GetNotificationsResponse {
    return this.notifyService.getNotifications(request);
  }
}
