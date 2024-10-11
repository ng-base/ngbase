import { Type } from '@angular/core';
import { DialogInput, basePortal } from '../portal';
import { Popover } from './popover.component';
import { PopoverOptions } from './popover.service';

export function basePopoverPortal<T>(component: Type<T>) {
  const NAME = 'popover';
  const base = basePortal(NAME, component);

  function open<T>(component: DialogInput<T>, options: PopoverOptions) {
    const { diaRef, parent, replace, childSignal } = base.open(
      component,
      (comp, opt) => {
        const compInst = comp.instance as Popover;
        compInst.setOptions(opt as PopoverOptions);
      },
      options,
    );

    return {
      diaRef,
      events: (parent.instance as Popover).events,
      parent: parent.instance,
      replace,
      childSignal,
    };
  }

  function closeAll() {
    base.closeAll();
  }
  return { open, closeAll };
}
