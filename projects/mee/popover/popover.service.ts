import { Signal, WritableSignal } from '@angular/core';
import { DialogInput, DialogOptions, DialogRef } from '@meeui/ui/portal';
import { Observable } from 'rxjs';
import { basePopoverPortal } from './base-popover.service';
import { Popover } from './popover';

export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right' | 'tl' | 'tr' | 'bl' | 'br';

export class PopoverOptions extends DialogOptions {
  target!: HTMLElement;
  el?: HTMLElement;
  position?: PopoverPosition;
  offset?: number;
  client?: { x: number; y: number; w: number; h: number } | null;
  className?: string;
  backdropClassName?: string;
  clipPath?: Signal<string>;
  anchor?: boolean;
  smoothScroll?: boolean;
}

export interface PopoverOpen<T> {
  diaRef: DialogRef<any>;
  events: Observable<{ type: string; value: any }>;
  parent: Popover;
  replace: ((component: DialogInput<T>) => void) | undefined;
  childSignal: WritableSignal<any>;
}

export type PopoverType = ReturnType<typeof popoverPortal>;

export function popoverPortal() {
  const base = basePopoverPortal(Popover);

  function open<T>(component: DialogInput<T>, options: PopoverOptions): PopoverOpen<T> {
    return base.open(component, options);
  }

  return { open, closeAll: base.closeAll };
}
