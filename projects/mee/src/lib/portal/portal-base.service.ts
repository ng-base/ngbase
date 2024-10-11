import {
  Type,
  inject,
  Injector,
  TemplateRef,
  ComponentRef,
  ViewContainerRef,
  EmbeddedViewRef,
  signal,
} from '@angular/core';
import { Subscription, first } from 'rxjs';
import { keyMap, Keys } from '../keys';
import { DialogOptions, DialogRef, createInj, BaseDialog } from './dialog-ref';
import { PortalService } from './portal.service';

export type DialogInput<T = any> = Type<T> | TemplateRef<any>;

export function basePortal<U>(name: string, baseComponent: Type<U>) {
  const NAME = name;
  const portal = inject(PortalService);
  const injector = inject(Injector);
  const keyManager = new Keys();

  function open<T>(
    component?: DialogInput<T>,
    callback?: (comp: ComponentRef<U>, opt: DialogOptions) => void,
    opt?: DialogOptions,
    animation = true,
  ) {
    const options = { ...new DialogOptions(), ...opt };
    const diaRef = new DialogRef(options, destroy, closeAll, animation);
    const childInjector = createInj(injector, options.data, diaRef);
    const parent = portal.create(baseComponent, childInjector, NAME);

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
      console.log('register esc');
      sub = keyMap('esc', () => diaRef.close(), { injector, stop: true });
    }

    function destroy() {
      portal.delete(NAME, parent);
      // console.log('destroyed');
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
