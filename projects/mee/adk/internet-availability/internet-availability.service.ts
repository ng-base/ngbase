import { Injectable, signal } from '@angular/core';
import { documentListener, isClient, ListnerOut } from '@meeui/ui/utils';

@Injectable({ providedIn: 'root' })
export class InternetAvailability {
  private status = signal(true);
  readonly isOnline = this.status.asReadonly();
  private listeners: ((status: boolean) => void)[] = [];
  private initialized = false;
  private onlineListner!: ListnerOut;
  private offlineListner!: ListnerOut;

  constructor() {
    if (isClient()) {
      this.status.set(navigator.onLine);
      this.onlineListner = documentListener('online', () => this.updateOnlineStatus(true), {
        element: window,
        lazy: true,
      });
      this.offlineListner = documentListener('offline', () => this.updateOnlineStatus(false), {
        element: window,
        lazy: true,
      });
    }
  }

  private on(): void {
    if (this.initialized) return;
    // window.addEventListener('online', () => this.updateOnlineStatus(true));
    // window.addEventListener('offline', () => this.updateOnlineStatus(false));
    this.onlineListner.on();
    this.offlineListner.on();
    this.initialized = true;
  }

  private off(): void {
    // window.removeEventListener('online', () => this.updateOnlineStatus(true));
    // window.removeEventListener('offline', () => this.updateOnlineStatus(false));
    this.onlineListner.off();
    this.offlineListner.off();
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
