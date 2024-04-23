import {
  Type,
  inject,
  Injector,
  TemplateRef,
  ComponentRef,
} from '@angular/core';
import { Subscription, first } from 'rxjs';
import { Keys } from '@meeui/keys';
import {
  DialogOptions,
  DialogRef,
  createInj,
  BaseDialogComponent,
} from './dialog-ref';
import { PortalService } from './portal.service';

export type DialogInput = Type<any> | TemplateRef<any>;

export function basePortal<U>(name: string, baseComponent: Type<U>) {
  const NAME = name;
  const dom = inject(PortalService);
  const injector = inject(Injector);
  const keyManager = new Keys();

  function open<T>(
    component?: DialogInput,
    callback?: (comp: ComponentRef<U>) => void,
    opt?: DialogOptions,
  ) {
    const options = { ...new DialogOptions(), ...opt };
    const diaRef = new DialogRef(options, destroy, closeAll);
    const childInjector = createInj(injector, options.data, diaRef);
    const parent = dom.createComponent(baseComponent, childInjector, NAME);

    // set options
    callback?.(parent);

    // close on backdrop click
    let sub: Subscription | undefined;

    if (component === undefined) {
      return { diaRef, parent };
    }

    // close on esc
    sub = keyManager.event('esc').subscribe(([_, ev]) => {
      ev.preventDefault();
      ev.stopPropagation();

      diaRef.close();
    });

    function destroy() {
      dom.deleteComponent(NAME, parent);
      sub?.unsubscribe();
    }

    (parent.instance as BaseDialogComponent).afterView
      .pipe(first())
      .subscribe((vcRef) => {
        // for template type
        if (component instanceof TemplateRef) {
          vcRef.createEmbeddedView(component, undefined, {
            injector: parent.injector,
          });
          diaRef.events.next('created');
          return;
        }
        // for component type
        const child = vcRef.createComponent(component, {
          injector: parent.injector,
        });
        diaRef.onDestroy.subscribe(() => child.destroy());
        diaRef.events.next('created');
      });

    return { diaRef, parent };
  }

  function closeAll() {
    dom.clear(NAME);
  }
  return { open, closeAll };
}
