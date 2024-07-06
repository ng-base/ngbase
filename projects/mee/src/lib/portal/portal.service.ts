import {
  Injectable,
  Injector,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  ApplicationRef,
  Type,
  ComponentRef,
  inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Portal } from './portal.component';

@Injectable({ providedIn: 'root' })
export class PortalService {
  private mainContainer: ComponentRef<Portal>;
  private document = inject(DOCUMENT);
  private componentFactoryResolver = inject(ComponentFactoryResolver);
  private injector = inject(Injector);
  private appRef = inject(ApplicationRef);

  private trackElements = new Map<string, ComponentRef<any>[]>();

  constructor() {
    this.mainContainer = this.appendComponentToBody(Portal);
  }

  private componentCreator() {
    return this.mainContainer.instance.myDialog()!;
  }

  appendComponentToBody<T>(component: Type<T>) {
    // 1. Create a component reference from the component
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory<T>(component)
      .create(this.injector);

    // 2. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(componentRef.hostView);

    // 3. Get DOM element from component
    const domElem = (componentRef.hostView as EmbeddedViewRef<unknown>).rootNodes[0] as HTMLElement;

    // 4. Append DOM element to the body
    this.document.body.appendChild(domElem);
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
    const index = this.trackElements.get(container)!.indexOf(component);
    this.trackElements.get(container)!.splice(index, 1);
  }

  clear(container: string) {
    if (this.trackElements.has(container)) {
      this.trackElements.get(container)!.forEach(c => {
        c.destroy();
      });
      this.trackElements.delete(container);
    }
  }
}
