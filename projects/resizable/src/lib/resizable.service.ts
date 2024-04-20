import { Injectable, signal } from '@angular/core';

@Injectable()
export class ResizableService {
  direction = signal<'horizontal' | 'vertical'>('horizontal');
  updateSize = signal<{ event: any; index: number } | null>(null);

  resize(event: any, index: number) {
    this.updateSize.set({ event, index });
  }
}
