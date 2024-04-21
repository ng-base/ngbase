import { inject, Injector, TemplateRef, Type } from '@angular/core';
import {
  PortalService,
  DialogOptions,
  DialogRef,
  createInj,
  DialogPosition,
} from '@meeui/portal';
import { Popover } from './popover.component';
import { first } from 'rxjs';

export function popoverPortal() {
  const NAME = 'popover';
  const dom = inject(PortalService);
  const injector = inject(Injector);

  function open<T>(
    component: Type<T> | TemplateRef<T>,
    target: HTMLElement,
    opt?: DialogOptions,
    priority?: DialogPosition,
  ) {
    const options = { ...new DialogOptions(), ...opt };
    const diaRef = new DialogRef(options, destroy, closeAll);
    const childInjector = createInj(injector, options.data, diaRef);
    const parent = dom.createComponent(Popover, childInjector, NAME);
    parent.instance.setOptions(options);
    parent.instance.target = target;
    parent.instance.position = priority || 'top';

    function destroy() {
      dom.deleteComponent(NAME, parent);
    }

    parent.instance.afterView.pipe(first()).subscribe((vcRef) => {
      // for template type
      if (component instanceof TemplateRef) {
        vcRef.createEmbeddedView(component, undefined, {
          injector: parent.injector,
        });
        return;
      }
      // for component type
      const child = vcRef.createComponent(component, {
        injector: parent.injector,
      });
      diaRef.onDestroy.subscribe(() => child.destroy());
    });

    const { afterClosed, close } = diaRef;
    return { afterClosed, close, events: parent.instance.events };
  }

  function closeAll() {
    dom.clear(NAME);
  }
  return { open, closeAll };
}
