import { Type } from '@angular/core';
import { DialogInput, DialogOptions, basePortal } from '../portal';
import { OverlayConfig } from '../portal/utils';
import { Popover } from './popover.component';

export function basePopoverPortal<T>(component: Type<T>) {
  const NAME = 'popover';
  const base = basePortal(NAME, component);

  function open<T>(
    component: DialogInput<T>,
    tooltipOptions: OverlayConfig,
    opt?: DialogOptions,
  ) {
    const { diaRef, parent, replace } = base.open(
      component,
      (comp, options) => {
        const compInst = comp.instance as Popover;
        compInst.setOptions(options);
        compInst.tooltipOptions = tooltipOptions;
      },
      opt,
    );

    return {
      diaRef,
      events: (parent.instance as Popover).events,
      parent: parent.instance,
      replace,
    };
  }

  function closeAll() {
    base.closeAll();
  }
  return { open, closeAll };
}
