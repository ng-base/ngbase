import { inject, InjectionToken, Signal, Type, WritableSignal } from '@angular/core';
import { DialogInput, DialogOptions, DialogRef } from '@ngbase/adk/portal';
import { Observable } from 'rxjs';
import { basePopoverPortal } from './base-popover.service';
import { NgbPopover } from './popover';
import { OverlayPosition, PopoverUtilConfig } from './utils';

export type PopoverPosition = OverlayPosition;

export class PopoverOptions extends DialogOptions implements PopoverUtilConfig {
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
  parent: NgbPopover;
  replace: ((component: DialogInput<T>) => void) | undefined;
  childSignal: WritableSignal<any>;
}

const POPOVER_TOKEN = new InjectionToken<Type<NgbPopover>>('POPOVER_TOKEN');

export type PopoverType = ReturnType<typeof ngbPopoverPortal>;

export function ngbPopoverPortal() {
  const popover = inject(POPOVER_TOKEN, { optional: true }) ?? NgbPopover;
  const base = basePopoverPortal(popover);

  function open<T>(component: DialogInput<T>, options: PopoverOptions): PopoverOpen<T> {
    return base.open(component, options);
  }

  return { open, closeAll: base.closeAll };
}

export const registerNgbPopover = (popover: typeof NgbPopover) => {
  return { provide: POPOVER_TOKEN, useValue: popover };
};
