import {
  Injectable,
  Injector,
  ApplicationRef,
  Type,
  ComponentRef,
  inject,
  EnvironmentInjector,
  createComponent,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Portal } from './portal.component';

@Injectable({ providedIn: 'root' })
export class PortalService {
  private mainContainer?: ComponentRef<Portal>;
  private document = inject(DOCUMENT);
  private appRef = inject(ApplicationRef);
  private environmentInjector = inject(EnvironmentInjector);

  private trackElements = new Map<string, ComponentRef<any>[]>();

  private componentCreator() {
    this.mainContainer ??= this.appendComponentToBody(Portal);
    return this.mainContainer!.instance.myDialog()!;
  }

  appendComponentToBody<T>(component: Type<T>) {
    // 1. Create a component reference from the component
    const componentRef = createComponent(component, {
      environmentInjector: this.environmentInjector,
    });

    // 2. append the component to the body
    this.document.body.appendChild(componentRef.location.nativeElement);

    // 3. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(componentRef.hostView);
    return componentRef;
  }

  createComponent<T>(component: Type<T>, injector: Injector, container: string) {
    const d = this.componentCreator().createComponent(component, { injector });
    if (!this.trackElements.has(container)) {
      this.trackElements.set(container, []);
    }
    this.trackElements.get(container)!.push(d);
    return d;
  }

  deleteComponent<T>(container: string, component: ComponentRef<T>) {
    component.destroy();
    const elements = this.trackElements.get(container);
    if (elements) {
      const index = elements.indexOf(component);
      elements.splice(index, 1);
    }
  }

  clear(container: string) {
    if (this.trackElements.has(container)) {
      const elements = this.trackElements.get(container);
      elements?.forEach(c => c.destroy());
      this.trackElements.delete(container);
    }
  }
}
