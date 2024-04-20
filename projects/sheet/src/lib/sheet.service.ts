import { inject, Injector, Type } from '@angular/core';
import { first } from 'rxjs';
import {
  DialogOptions,
  DialogRef,
  createInj,
} from '../../../dialog/src/lib/dialog-ref';
import { PortalService } from '@meeui/portal';
import { SheetComponent } from './sheet.component';

export function sheetPortal() {
  const NAME = 'sheet';
  const dom = inject(PortalService);
  const injector = inject(Injector);

  function open<T>(component: Type<T>, opt?: DialogOptions) {
    const options = { ...new DialogOptions(), ...opt };
    const d = SheetComponent as Type<SheetComponent>;
    const parent = dom.createComponent(d, injector, NAME);
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
