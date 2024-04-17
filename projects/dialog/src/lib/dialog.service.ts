import { Injector, Type, inject } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { DialogOptions, createInj, DialogRef } from './dialog-ref';
import { first } from 'rxjs';
import { PortalService } from '@meeui/portal';

export function dialogPortal() {
  const dom = inject(PortalService);
  const injector = inject(Injector);

  function open<T>(component: Type<T>, opt?: DialogOptions) {
    const options = { ...new DialogOptions(), ...opt };
    const d = DialogComponent as Type<DialogComponent>;
    const parent = dom.componentCreator.createComponent(d, { injector });
    parent.instance.setOptions(options);

    const diaRef = new DialogRef(parent, options);
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
    dom.componentCreator.clear();
  }
  return { open, closeAll };
}
