import {
  DebugElement,
  EnvironmentProviders,
  OutputEmitterRef,
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

class AngularQuery {
  constructor(public dEl: DebugElement) {}

  viewChild<U>(directive: Type<U>, selector?: string | Type<any>): U {
    return this.queryNative(selector || directive).injector.get(directive);
  }

  viewChildren<U>(directive: Type<U>, selector?: string): U[] {
    return this.viewChildrenDebug(selector || directive).map(de => de.injector.get(directive));
  }

  viewChildrenDebug<U>(directive: string | Type<U>) {
    return this.dEl.queryAll(this.getDirectiveType(directive));
  }

  queryNative<U>(directive: string | Type<U>) {
    return this.dEl.query(this.getDirectiveType(directive));
  }

  private getDirectiveType(directive: string | Type<any>) {
    return typeof directive === 'string' ? By.css(directive) : By.directive(directive);
  }
}

export class ElementHelper<T extends HTMLElement> extends AngularQuery {
  public el!: T;

  constructor(public override dEl: DebugElement) {
    super(dEl);
    this.el = dEl.nativeElement;
  }

  get textContent() {
    return this.el.textContent;
  }

  $<U extends HTMLElement>(selector: string | Type<any>): ElementHelper<U> {
    const el = this.queryNative(selector);
    return el ? new ElementHelper(el) : (null as any);
  }

  $All<U extends HTMLElement>(selector: string | Type<any>): ElementHelper<U>[] {
    return this.viewChildrenDebug(selector).map(de => new ElementHelper(de));
  }

  getByText(text: string, root: string | Type<any> = 'body'): HTMLElement | null {
    const rootEl = this.$(root).el;
    const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_ELEMENT, null);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if ((node as HTMLElement).textContent?.trim() === text) {
        return node as HTMLElement;
      }
    }
    return null;
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

  css(name: string, value?: string) {
    if (value !== undefined) {
      this.el.style.setProperty(name, value);
    }
    return this.el.style.getPropertyValue(name);
  }

  click() {
    this.el.click();
  }

  focus() {
    this.el.focus();
    const focusEvent = new Event('focus', { bubbles: true, cancelable: true });
    this.el.dispatchEvent(focusEvent);
  }

  keydown(key: string, options?: KeyboardEventInit) {
    const event = new KeyboardEvent('keydown', {
      key,
      cancelable: true,
      bubbles: true,
      ...options,
    });
    this.el.dispatchEvent(event);
    return event;
  }

  mouseDown(options?: MouseEventInit) {
    const event = new MouseEvent('mousedown', { cancelable: true, bubbles: true, ...options });
    this.el.dispatchEvent(event);
    return event;
  }

  mouseEnter(options?: MouseEventInit) {
    const event = new MouseEvent('mouseenter', { cancelable: true, bubbles: true, ...options });
    this.el.dispatchEvent(event);
    return event;
  }

  mouseLeave(options?: MouseEventInit) {
    const event = new MouseEvent('mouseleave', { cancelable: true, bubbles: true, ...options });
    this.el.dispatchEvent(event);
    return event;
  }

  input(value: string | ((v: any) => any)) {
    if (this.el instanceof HTMLInputElement) {
      this.el.value = typeof value === 'function' ? value(this.el.value) : value;
      this.el.dispatchEvent(new Event('input'));
    } else {
      throw new Error('Element is not an input');
    }
  }

  paste(text: string) {
    const pasteEvent = new CustomEvent('paste', {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(pasteEvent, 'clipboardData', {
      writable: true,
      value: {
        getData: () => text,
      },
    });

    this.el.dispatchEvent(pasteEvent);
    return pasteEvent;
  }

  type(value: string | string[], clear = false) {
    if (clear) {
      this.input('');
    }
    // Ensure the input has focus
    if (document.activeElement !== this.el) {
      this.focus();
    }
    let event: KeyboardEvent | MouseEvent;
    for (const char of value) {
      event = this.keydown(char);
      if (event.defaultPrevented) {
        continue;
      }

      // Trigger keypress event (deprecated, but some implementations might use it)
      event = new KeyboardEvent('keypress', { key: char, bubbles: true });
      if (!this.el.dispatchEvent(event)) {
        continue;
      }

      // Append character to input value
      if (char === 'Backspace') {
        this.input(v => v.slice(0, -1));
      } else if (char === 'Delete') {
        const caretPosition = (this.el as unknown as HTMLInputElement).selectionStart || 0;
        this.input(v => v.slice(0, caretPosition) + v.slice(caretPosition + 1));
      } else if (/^[a-zA-Z0-9]$/.test(char)) {
        this.input(v => v + char);
      }

      // Trigger keyup event
      const keyupEvent = new KeyboardEvent('keyup', { key: char, bubbles: true });
      this.el.dispatchEvent(keyupEvent);
    }
    return event!;
  }
}

export class RenderResult<T> extends ElementHelper<HTMLElement> {
  host!: T;

  constructor(public fixture: ComponentFixture<T>) {
    super(fixture.debugElement);
    this.host = fixture.componentInstance;
  }

  detectChanges(): void {
    this.fixture.detectChanges();
  }

  async whenStable(): Promise<void> {
    this.fixture.detectChanges();
    await this.fixture.whenStable();
  }

  async formStable(): Promise<void> {
    await this.whenStable();
    // We have to wait for the UI to be updated
    this.fixture.detectChanges();
  }

  async sleep(ms: number) {
    await sleep(ms);
  }

  inject<U>(directive: Type<U>) {
    return injectService(directive);
  }

  injectHost<U>(directive: Type<U>) {
    return this.fixture.debugElement.injector.get(directive);
  }

  queryRoot<U extends HTMLElement>(selector: string): ElementHelper<U> {
    const el = document.querySelector(selector) as U;
    return el ? new ElementHelper<U>({ nativeElement: el } as any) : (null as any);
  }

  setInput(name: string, value: any) {
    this.fixture.componentRef.setInput(name, value);
  }
}

export function fakeService<T extends Type<any>>(
  service: T,
  impl: Partial<InstanceType<T>> | (() => Partial<InstanceType<T>>),
) {
  const fn = typeof impl === 'function' ? impl : () => impl;
  return { provide: service, useFactory: fn };
}

type FakeService<T extends Type<any>> = ReturnType<typeof fakeService<T>>;
type RenderProvider = Provider | EnvironmentProviders | FakeService<any>;

export async function render<T>(
  component: Type<T>,
  providers: RenderProvider[] = [],
  options?: {
    inputs?: [string, any][];
    overrides?: [Type<any>, Type<any>, 'component' | 'directive' | 'pipe'][];
    providers?: FakeService<any>[];
  },
) {
  if (providers.length || options?.providers?.length || options?.overrides?.length) {
    const bed = TestBed.configureTestingModule({
      imports: [component],
      providers,
    });

    options?.providers?.forEach(({ provide, useFactory }) => {
      bed.overrideProvider(provide, { useFactory });
    });

    options?.overrides?.forEach(([from, to, type]) => {
      if (type === 'component') {
        bed.overrideComponent(component, { remove: [from] as any, add: [to] as any });
      } else if (type === 'directive') {
        bed.overrideDirective(component, { remove: [from] as any, add: [to] as any });
      } else if (type === 'pipe') {
        bed.overridePipe(component, { remove: [from] as any, add: [to] as any });
      }
    });
    await bed.compileComponents();
  }
  const fixture = TestBed.createComponent(component);

  // Set inputs
  options?.inputs?.forEach(([name, value]) => {
    fixture.componentRef.setInput(name, value);
  });
  return new RenderResult(fixture);
}

export function injectService<T>(service: Type<T>, providers: RenderProvider[] = []) {
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

export async function sleep(ms: number) {
  await new Promise(resolve => setTimeout(resolve, ms));
}
