import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class SseService {
  private subjects: { [userId: string]: Subject<any> } = {};

  getSubjects() {
    return this.subjects;
  }

  subscribe(userId: string): Observable<any> {
    console.log(`Subscribing user: ${userId}`);
    if (!this.subjects[userId]) {
      this.subjects[userId] = new Subject();
      console.log(`Subject created for user: ${userId}`);
    } else {
      console.log(`Subject already exists for user: ${userId}`);
    }

    console.log('Current subjects:', Object.keys(this.subjects));
    return this.subjects[userId].asObservable();
  }

  broadcastToUsers(receivers: string[], message: any) {
    console.log('Broadcasting to receivers:', receivers);
    console.log('Available subjects:', Object.keys(this.subjects));

    receivers.forEach((userId) => {
      if (this.subjects[userId]) {
        console.log(`Broadcasting message to user: ${userId}`);
        this.subjects[userId].next({ data: message });
      } else {
        console.log(`No active subscription for user: ${userId}`);
      }
    });
  }

  cleanUpUser(userId: string) {
    console.log(`Cleaning up user ${userId}`);
    if (this.subjects[userId]) {
      this.subjects[userId].complete();
      delete this.subjects[userId];
    }
  }
}
