import { DebugElement, OutputEmitterRef, Provider, Type } from '@angular/core';
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

  async sleep(ms: number) {
    await sleep(ms);
  }

  inject<U>(directive: Type<U>) {
    return injectService(directive);
  }

  injectHost<U>(directive: Type<U>) {
    return this.fixture.debugElement.injector.get(directive);
  }

  viewChild<U>(directive: Type<U>, selector?: string | Type<any>): U {
    return this.queryNative(selector || directive).injector.get(directive);
  }

  viewChildren<U>(directive: Type<U>, selector?: string): U[] {
    return this.viewChildrenDebug(selector || directive).map(de => de.injector.get(directive));
  }

  viewChildrenDebug<U>(directive: string | Type<U>) {
    return this.fixture.debugElement.queryAll(this.getDirectiveType(directive));
  }

  queryNative<U>(directive: string | Type<U>) {
    return this.fixture.debugElement.query(this.getDirectiveType(directive));
  }

  queryRoot<U extends HTMLElement>(selector: string): ElementHelper<U> {
    const el = document.querySelector(selector) as U;
    return el ? new ElementHelper<U>({ nativeElement: el } as any) : (null as any);
  }

  $<U = HTMLElement>(selector: string | Type<any>): U {
    return this.queryNative(selector)?.nativeElement as U;
  }

  getByText(text: string, root: string | Type<any> = 'body'): HTMLElement | null {
    const rootEl = this.$(root);
    const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_ELEMENT, null);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if ((node as HTMLElement).textContent?.trim() === text) {
        return node as HTMLElement;
      }
    }
    return null;
  }

  $All<U = HTMLElement>(selector: string | Type<any>): U[] {
    return this.viewChildrenDebug(selector).map(de => de.nativeElement);
  }

  $0<U extends HTMLElement>(selector: string | Type<any>): ElementHelper<U> {
    const el = this.queryNative(selector);
    return el ? new ElementHelper(el) : (null as any);
  }

  $0Native<U extends HTMLElement>(): ElementHelper<U> {
    return new ElementHelper(this.fixture.debugElement);
  }

  $0All<U extends HTMLElement>(selector: string | Type<any>): ElementHelper<U>[] {
    return this.viewChildrenDebug(selector).map(de => new ElementHelper(de));
  }

  setInput(name: string, value: any) {
    this.fixture.componentRef.setInput(name, value);
  }

  private getDirectiveType(directive: string | Type<any>) {
    return typeof directive === 'string' ? By.css(directive) : By.directive(directive);
  }
}

export async function render<T>(
  component: Type<T>,
  providers: Provider[] = [],
  inputs: [string, any][] = [],
  overrides: [Type<any>, Type<any>, 'component' | 'directive' | 'pipe'][] = [],
) {
  if (providers.length) {
    const bed = TestBed.configureTestingModule({
      imports: [component],
      providers,
    });
    overrides.forEach(([from, to, type]) => {
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
  inputs.forEach(([name, value]) => {
    fixture.componentRef.setInput(name, value);
  });
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
  public el!: T;

  constructor(public dEl: DebugElement) {
    this.el = dEl.nativeElement;
  }

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

export async function sleep(ms: number) {
  await new Promise(resolve => setTimeout(resolve, ms));
}
