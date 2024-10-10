import { Injectable } from '@angular/core';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { BehaviorSubject, Subscription } from 'rxjs';

export enum IdleState {
  INIT,
  IDLE_START,
  IDLE_END,
  TIMEOUT,
  TIMEOUT_WARNING,
  PING
}

export interface IdleData {
  state: IdleState;
  countdown?: number;
}

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleStateSource = new BehaviorSubject<IdleData>({
    state: IdleState.INIT
  });
  private subscriptions: Subscription[] = [];

  idleState$ = this.idleStateSource.asObservable();

  constructor(
    private idle: Idle,
    private keepalive: Keepalive
  ) {}

  startIdleTimer(idleTime: number, timeoutMax: number): void {
    this.idle.setIdle(idleTime);
    this.idle.setTimeout(timeoutMax);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.subscriptions.push(
      this.idle.onIdleStart.subscribe(() => {
        //this.idle.clearInterrupts();
        this.idleStateSource.next({ state: IdleState.IDLE_START });
      })
    );

    this.subscriptions.push(
      this.idle.onIdleEnd.subscribe(() => {
        this.idleStateSource.next({ state: IdleState.IDLE_END });
      })
    );

    this.subscriptions.push(
      this.idle.onTimeout.subscribe(() => {
        this.idleStateSource.next({ state: IdleState.TIMEOUT });
      })
    );

    this.subscriptions.push(
      this.idle.onTimeoutWarning.subscribe((countdown: number) => {
        this.idleStateSource.next({
          state: IdleState.TIMEOUT_WARNING,
          countdown: countdown
        });
      })
    );

    this.keepalive.interval(15);
    this.subscriptions.push(
      this.keepalive.onPing.subscribe(() => {
        this.idle.watch();
        this.idleStateSource.next({ state: IdleState.PING });
      })
    );

    // Start watching for idleness
    this.idle.watch();
  }

  stopIdleTimer(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];

    this.idle.stop();
    this.keepalive.stop();
  }
}
