import { Injector, Type, inject } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { first } from 'rxjs';
import {
  PortalService,
  DialogOptions,
  createInj,
  DialogRef,
} from '@meeui/portal';

export function dialogPortal() {
  const NAME = 'dialog';
  const dom = inject(PortalService);
  const injector = inject(Injector);

  function open<T>(component: Type<T>, opt?: DialogOptions) {
    const options = { ...new DialogOptions(), ...opt };
    const diaRef = new DialogRef(options, destroy, closeAll);
    const childInjector = createInj(injector, options.data, diaRef);
    const parent = dom.createComponent(DialogComponent, childInjector, NAME);
    parent.instance.setOptions(options);

    function destroy() {
      dom.deleteComponent(NAME, parent);
    }

    parent.changeDetectorRef.markForCheck();

    parent.instance.afterView.pipe(first()).subscribe((vcRef) => {
      const child = vcRef.createComponent(component, {
        injector: parent.injector,
      });
      diaRef.onDestroy.subscribe(() => child.destroy());
    });

    const { afterClosed } = diaRef;
    return { afterClosed };
  }

  function closeAll() {
    dom.clear(NAME);
  }
  return { open, closeAll };
}
