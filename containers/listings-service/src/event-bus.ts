import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export interface WasityEvent {
  type: string;
  payload: any;
  timestamp: Date;
}

@Injectable()
export class EventBus {
  private events = new Subject<WasityEvent>();

  emit(type: string, payload: any) {
    const event: WasityEvent = {
      type,
      payload,
      timestamp: new Date(),
    };
    this.events.next(event);
    console.log(`📡 Event: ${type}`, JSON.stringify(payload).substring(0, 100));
  }

  on(type: string, handler: (event: WasityEvent) => void) {
    this.events.subscribe((event) => {
      if (event.type === type) {
        handler(event);
      }
    });
  }
}
