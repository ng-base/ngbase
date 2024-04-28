import { Injectable, signal } from '@angular/core';
import { DragData } from '../drag';

@Injectable()
export class ResizableService {
  direction = signal<'horizontal' | 'vertical'>('horizontal');
  updateSize = signal<{ event: DragData; index: number } | null>(null);

  resize(event: DragData, index: number) {
    this.updateSize.set({ event, index });
  }
}
