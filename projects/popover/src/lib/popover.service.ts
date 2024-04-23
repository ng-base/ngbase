import {
  DialogInput,
  DialogOptions,
  DialogPosition,
  basePortal,
} from '@meeui/portal';
import { Popover } from './popover.component';

export function popoverPortal() {
  const NAME = 'popover';
  const base = basePortal(NAME, Popover);

  function open<T>(
    component: DialogInput,
    target: HTMLElement,
    opt?: DialogOptions,
    priority?: DialogPosition,
  ) {
    const { diaRef, parent } = base.open(component, (comp) => {
      const options = { ...new DialogOptions(), ...opt };
      comp.instance.setOptions(options);
      comp.instance.target = target;
      comp.instance.position = priority || 'top';
    });

    return { diaRef, events: parent.instance.events };
  }

  function closeAll() {
    base.closeAll();
  }
  return { open, closeAll };
}
