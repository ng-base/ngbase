import { Type } from '@angular/core';
import { basePortal, DialogInput } from '@meeui/adk/portal';
import { MeePopover } from './popover';
import { PopoverOptions } from './popover.service';

export function basePopoverPortal<T>(component: Type<T>) {
  const NAME = 'popover';
  const base = basePortal(NAME, component);

  function open<T>(component: DialogInput<T>, options: PopoverOptions) {
    const { diaRef, parent, replace, childSignal } = base.open(
      component,
      (comp, opt) => {
        const compInst = comp.instance as MeePopover;
        compInst.setOptions(opt as PopoverOptions);
      },
      options,
    );

    return {
      diaRef,
      events: (parent.instance as MeePopover).events,
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
