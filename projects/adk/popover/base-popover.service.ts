import { Type } from '@angular/core';
import { basePortal, DialogInput } from '@ngbase/adk/portal';
import { NgbPopover } from './popover';
import { PopoverOptions } from './popover.service';

export function basePopoverPortal<T>(component: Type<T>) {
  const NAME = 'popover';
  const base = basePortal(NAME, component);

  function open<T>(component: DialogInput<T>, options: PopoverOptions) {
    const { diaRef, parent, replace, childSignal } = base.open(
      component,
      (comp, opt) => {
        const compInst = comp.instance as NgbPopover;
        compInst.setOptions(opt as PopoverOptions);
      },
      options,
    );

    return {
      diaRef,
      events: (parent.instance as NgbPopover).events,
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
