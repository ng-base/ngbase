import { Injectable, signal } from '@angular/core';
import { isClient } from '../ssr';

@Injectable({
  providedIn: 'root',
})
export class InternetAvailabilityService {
  private isOnline = signal(true);
  isCurrentlyOnline = this.isOnline.asReadonly();
  private listeners: ((status: boolean) => void)[] = [];

  constructor() {
    if (isClient()) {
      this.isOnline.set(navigator.onLine);
      this.initializeNetworkListeners();
    }
  }

  private initializeNetworkListeners(): void {
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
  }

  private updateOnlineStatus(status: boolean): void {
    this.isOnline.set(status);
    this.listeners.forEach(listener => listener(this.isOnline()));
  }

  public addListener(listener: (status: boolean) => void): void {
    this.listeners.push(listener);
    listener(this.isOnline()); // Immediately call with current status
  }

  public removeListener(listener: (status: boolean) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }
}
