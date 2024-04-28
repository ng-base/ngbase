import { DialogInput, DialogOptions, basePortal } from '../portal';
import { OverlayConfig } from '../portal/utils';
import { Popover } from './popover.component';

export function popoverPortal() {
  const NAME = 'popover';
  const base = basePortal(NAME, Popover);

  function open<T>(
    component: DialogInput<T>,
    tooltipOptions: OverlayConfig,
    opt?: DialogOptions,
  ) {
    const { diaRef, parent } = base.open(component, (comp) => {
      const options = { ...new DialogOptions(), ...opt };
      comp.instance.setOptions(options);
      comp.instance.tooltipOptions = tooltipOptions;
    });

    return {
      diaRef,
      events: parent.instance.events,
    };
  }

  function closeAll() {
    base.closeAll();
  }
  return { open, closeAll };
}
