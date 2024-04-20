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
    const parent = dom.createComponent(d, injector, 'dialog');
    parent.instance.setOptions(options);

    function destroy() {
      dom.deleteComponent('dialog', parent);
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
    dom.clear('dialog');
  }
  return { open, closeAll };
}
