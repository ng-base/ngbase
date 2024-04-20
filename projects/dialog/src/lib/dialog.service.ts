import { Injector, Type, inject } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { DialogOptions, createInj, DialogRef } from './dialog-ref';
import { first } from 'rxjs';
import { PortalService } from '@meeui/portal';

export function dialogPortal() {
  const NAME = 'dialog';
  const dom = inject(PortalService);
  const injector = inject(Injector);

  function open<T>(component: Type<T>, opt?: DialogOptions) {
    const options = { ...new DialogOptions(), ...opt };
    const parent = dom.createComponent(DialogComponent, injector, NAME);
    parent.instance.setOptions(options);

    function destroy() {
      dom.deleteComponent(NAME, parent);
    }

    const diaRef = new DialogRef(parent.instance, options, destroy);
    parent.changeDetectorRef.markForCheck();

    parent.instance.afterView.pipe(first()).subscribe((vcRef) => {
      const child = vcRef.createComponent(component, {
        injector: createInj(injector, options.data, diaRef),
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
