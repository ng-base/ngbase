import {
  OutputEmitterRef,
  provideExperimentalZonelessChangeDetection,
  Provider,
  Type,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

// export function mock<T>(service: new (...args: any[]) => T, properties: () => Partial<T>) {
//   // const cloned = { ...properties } as Partial<T> & { resetMock: () => Partial<T> };
//   // const initialProperties = { ...properties };

//   // const resetMock = () => {
//   //   Object.keys(initialProperties).forEach(key => {
//   //     (cloned as any)[key] = initialProperties[key];
//   //   });
//   //   return cloned;
//   // };

//   // cloned.resetMock = resetMock;
//   return () => ({ provide: service, useValue: properties() });
// }

// export function mockService<T>(service: new (...args: any[]) => T, properties: Partial<T>) {
//   return mock(service, () => properties)();
// }

export class RenderResult<T> {
  host!: T;

  constructor(public fixture: ComponentFixture<T>) {
    this.host = fixture.componentInstance;
  }

  detectChanges(): void {
    this.fixture.detectChanges();
  }

  type(selector: string | Type<any>, value: string) {
    const el = this.$(selector);
    const valueSplit = value.split('');
    valueSplit.forEach(char => {
      const keyEvent = new KeyboardEvent('keydown', { key: char, cancelable: true });
      el.dispatchEvent(keyEvent);
    });
  }

  async whenStable(): Promise<void> {
    this.fixture.detectChanges();
    await this.fixture.whenStable();
  }

  async formStable(): Promise<void> {
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    // We have to wait for the UI to be updated
    this.fixture.detectChanges();
  }

  inject<U>(directive: Type<U>) {
    return injectService(directive);
  }

  viewChild<U>(directive: Type<U>, selector?: string): U {
    return this.fixture.debugElement
      .query(this.getDirectiveType(selector || directive))
      .injector.get(directive);
  }

  viewChildren<U>(directive: string | Type<U>): U[] {
    return this.viewChildrenDebug(directive).map(de => de.componentInstance);
  }

  viewChildrenDebug<U>(directive: string | Type<U>) {
    return this.fixture.debugElement.queryAll(this.getDirectiveType(directive));
  }

  queryNative<U>(directive: string | Type<U>) {
    return this.fixture.debugElement.query(this.getDirectiveType(directive));
  }

  $<U = HTMLElement>(selector: string | Type<any>): U {
    return this.queryNative(selector)?.nativeElement as U;
  }

  $$<U = HTMLElement>(selector: string | Type<any>): U[] {
    return this.viewChildrenDebug(selector).map(de => de.nativeElement);
  }

  $0<U extends HTMLElement>(selector: string | Type<any>): ElementHelper<U> {
    return new ElementHelper(this.$(selector));
  }

  setInput(name: string, value: any) {
    this.fixture.componentRef.setInput(name, value);
  }

  private getDirectiveType(directive: string | Type<any>) {
    return typeof directive !== 'string' ? By.directive(directive) : By.css(directive);
  }
}

export async function render<T>(component: Type<T>, providers: Provider[] = []) {
  if (providers.length) {
    await TestBed.configureTestingModule({
      imports: [component],
      // providers: [provideExperimentalZonelessChangeDetection(), ...providers],
      providers,
    }).compileComponents();
  }
  const fixture = TestBed.createComponent(component);
  return new RenderResult(fixture);
}

export function injectService<T>(service: Type<T>, providers: Provider[] = []) {
  if (providers.length) {
    TestBed.configureTestingModule({ providers });
  }
  return TestBed.inject(service);
}

export function firstOutputFrom<T>(observable: OutputEmitterRef<T>) {
  return new Promise<T>(resolve => {
    const sub = observable.subscribe(value => {
      sub.unsubscribe();
      resolve(value);
    });
  });
}

export class ElementHelper<T extends HTMLElement> {
  constructor(public el: T) {}

  get textContent() {
    return this.el.textContent;
  }

  hasClass(...classNames: string[]) {
    return classNames.every(className => this.el.classList.contains(className));
  }

  attr(name: string, value?: string) {
    if (value !== undefined) {
      this.el.setAttribute(name, value);
    }
    return this.el.getAttribute(name);
  }
}
