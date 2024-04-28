import { TemplateRef, Type } from '@angular/core';
import { popoverPortal } from '../popover';
import { DialogOptions } from '../portal';

export function hoverCardPortal() {
  const popover = popoverPortal();

  function open<T>(
    component: Type<T> | TemplateRef<T>,
    target: HTMLElement,
    opt?: DialogOptions,
  ) {
    return popover.open(component, { target }, opt);
  }

  function closeAll() {
    popover.closeAll();
  }

  return { open, closeAll };
}
