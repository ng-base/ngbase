import {
  ComponentRef,
  EmbeddedViewRef,
  Injector,
  TemplateRef,
  Type,
  ViewContainerRef,
  inject,
  signal,
} from '@angular/core';
import { keyMap } from '@meeui/adk/keys';
import { first } from 'rxjs';
import { BaseDialog, DialogInput, DialogOptions, DialogRef, createInj } from './dialog-ref';
import { PortalService } from './portal.service';

export function basePortal<U>(name: string, baseComponent: Type<U>) {
  const NAME = name;
  const portal = inject(PortalService);
  const injector = inject(Injector);

  function open<T>(
    component?: DialogInput<T>,
    callback?: (comp: ComponentRef<U>, opt: DialogOptions) => void,
    opt?: DialogOptions,
    animation = true,
    parentComponent?: Type<U>,
  ) {
    const options = { ...new DialogOptions(), ...opt };
    const diaRef = new DialogRef(options, destroy, closeAll, animation);
    const childInjector = createInj(injector, options.data, diaRef);
    const parent = portal.create(parentComponent || baseComponent, childInjector, NAME);

    // set options
    callback?.(parent, options);

    // close on backdrop click
    let sub: () => void | undefined;
    const childSignal = signal<any>(undefined);

    if (component === undefined) {
      return { diaRef, parent, instance: null, childSignal };
    }

    // close on esc
    if (!options.disableClose) {
      sub = keyMap('esc', () => diaRef.close(), { injector, stop: true });
    }

    function destroy() {
      portal.delete(NAME, parent);
      sub?.();
    }

    let vwRef: ViewContainerRef;
    let child: ComponentRef<any> | EmbeddedViewRef<any>;
    const parentInstance = parent.instance as BaseDialog;

    parentInstance.afterView.pipe(first()).subscribe(vcRef => {
      vwRef = vcRef;
      createChild(component, vcRef);

      // diaRef.onDestroy.subscribe(() => child.destroy());
      diaRef.events.next('created');
      childSignal.set(child);
    });

    function replace(component: DialogInput<T>) {
      if (vwRef) {
        vwRef.clear();
        createChild(component, vwRef);
      }
    }

    function createChild(component: DialogInput<any>, vcRef: ViewContainerRef) {
      // for template type
      if (component instanceof TemplateRef) {
        child = vcRef.createEmbeddedView(
          component,
          { $implicit: options.data },
          { injector: parent.injector },
        );
        diaRef.events.next('created');
        return;
      }
      // for component type
      child = vcRef.createComponent(component, {
        injector: parent.injector,
      });
    }
    // parent.instance.

    return { diaRef, parent, replace, childSignal };
  }

  function closeAll() {
    portal.clear(NAME);
  }
  return { open, closeAll };
}
