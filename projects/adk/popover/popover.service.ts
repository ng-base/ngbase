import { inject, InjectionToken, Signal, Type, WritableSignal } from '@angular/core';
import { DialogInput, DialogOptions, DialogRef } from '@meeui/adk/portal';
import { Observable } from 'rxjs';
import { basePopoverPortal } from './base-popover.service';
import { MeePopover } from './popover';

export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right' | 'tl' | 'tr' | 'bl' | 'br';

export class PopoverOptions extends DialogOptions {
  target!: HTMLElement;
  el?: HTMLElement;
  position?: PopoverPosition;
  offset?: number;
  sideOffset?: number;
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
  parent: MeePopover;
  replace: ((component: DialogInput<T>) => void) | undefined;
  childSignal: WritableSignal<any>;
}

const POPOVER_TOKEN = new InjectionToken<Type<MeePopover>>('POPOVER_TOKEN');

export type PopoverType = ReturnType<typeof meePopoverPortal>;

export function meePopoverPortal() {
  const popover = inject(POPOVER_TOKEN, { optional: true }) ?? MeePopover;
  const base = basePopoverPortal(popover);

  function open<T>(component: DialogInput<T>, options: PopoverOptions): PopoverOpen<T> {
    return base.open(component, options);
  }

  return { open, closeAll: base.closeAll };
}

export const registerMeePopover = (popover: Type<MeePopover>) => {
  return { provide: POPOVER_TOKEN, useValue: popover };
};
