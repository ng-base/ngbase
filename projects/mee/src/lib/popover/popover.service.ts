import { Observable } from 'rxjs';
import { DialogInput, DialogOptions, DialogRef } from '../portal';
import { OverlayConfig } from '../portal/utils';
import { basePopoverPortal } from './base-popover.service';
import { Popover } from './popover.component';

export interface PopoverOpen<T> {
  diaRef: DialogRef<any>;
  events: Observable<{ type: string; value: any }>;
  parent: Popover;
  replace: ((component: DialogInput<T>) => void) | undefined;
}

export function popoverPortal() {
  const base = basePopoverPortal(Popover);

  function open<T>(
    component: DialogInput<T>,
    tooltipOptions: OverlayConfig,
    opt?: DialogOptions,
  ): PopoverOpen<T> {
    return base.open(component, tooltipOptions, opt);
  }

  return { open, closeAll: base.closeAll };
}
