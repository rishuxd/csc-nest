import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class SseService {
  private subjects: { [userId: string]: Subject<any> } = {};

  getSubjects() {
    return this.subjects;
  }

  subscribe(userId: string): Observable<any> {
    console.log(`[INFO] Subscribing user: ${userId}`);
    if (!this.subjects[userId]) {
      this.subjects[userId] = new Subject();
      console.log(`[INFO] Subject created for user: ${userId}`);
    } else {
      console.log(`[INFO] Subject already exists for user: ${userId}`);
    }

    console.log(`[INFO] Current subjects: ${Object.keys(this.subjects)}`);
    return this.subjects[userId].asObservable().pipe(
      finalize(() => {
        this.cleanUpUser(userId);
      }),
    );
  }

  broadcastToUsers(receivers: string[], message: any) {
    console.log(`[INFO] Broadcasting to receivers: ${receivers}`);
    console.log(`[INFO] Available subjects: ${Object.keys(this.subjects)}`);

    receivers.forEach((userId) => {
      if (this.subjects[userId]) {
        try {
          console.log(`[INFO] Broadcasting message to user: ${userId}`);
          this.subjects[userId].next({ data: message });
        } catch (error) {
          console.error(
            `[ERROR] Failed to broadcast to user ${userId}:`,
            error.message,
          );
        }
      } else {
        console.warn(`[WARN] No active subscription for user: ${userId}`);
      }
    });
  }

  cleanUpUser(userId: string) {
    console.log(`[INFO] Cleaning up user ${userId}`);
    if (this.subjects[userId]) {
      this.subjects[userId].complete();
      delete this.subjects[userId];
      console.log(`[INFO] User ${userId} cleaned up.`);
    } else {
      console.log(`[WARN] User ${userId} not found in subjects.`);
    }
  }

  cleanUpAll() {
    console.log(`[INFO] Cleaning up all inactive users.`);
    Object.keys(this.subjects).forEach((userId) => this.cleanUpUser(userId));
  }
}
