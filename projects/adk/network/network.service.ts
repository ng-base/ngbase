import { inject, Injectable, signal } from '@angular/core';
import { isClient } from '@ngbase/adk/utils';
import { documentListener, ListenerOut } from '@ngbase/adk/utils';

@Injectable({ providedIn: 'root' })
export class Network {
  private status = signal(true);
  readonly isOnline = this.status.asReadonly();
  private listeners: ((status: boolean) => void)[] = [];
  private initialized = false;
  private onlineListener!: ListenerOut;
  private offlineListener!: ListenerOut;

  constructor() {
    if (isClient()) {
      this.status.set(navigator.onLine);
      this.onlineListener = documentListener('online', () => this.updateOnlineStatus(true), {
        element: window,
        lazy: true,
      });
      this.offlineListener = documentListener('offline', () => this.updateOnlineStatus(false), {
        element: window,
        lazy: true,
      });
    }
  }

  private on(): void {
    if (this.initialized) return;
    // window.addEventListener('online', () => this.updateOnlineStatus(true));
    // window.addEventListener('offline', () => this.updateOnlineStatus(false));
    this.onlineListener.on();
    this.offlineListener.on();
    this.initialized = true;
  }

  private off(): void {
    // window.removeEventListener('online', () => this.updateOnlineStatus(true));
    // window.removeEventListener('offline', () => this.updateOnlineStatus(false));
    this.onlineListener.off();
    this.offlineListener.off();
    this.initialized = false;
  }

  private updateOnlineStatus(status: boolean): void {
    this.status.set(status);
    this.listeners.forEach(listener => listener(this.status()));
  }

  public addListener(listener: (status: boolean) => void): void {
    this.listeners.push(listener);
    listener(this.status()); // Immediately call with current status
    this.on();
  }

  public removeListener(listener: (status: boolean) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) this.listeners.splice(index, 1);
    if (this.listeners.length === 0) this.off();
  }
}

export const injectNetwork = () => inject(Network);
