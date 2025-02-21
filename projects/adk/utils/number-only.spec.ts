import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ElementHelper, render, RenderResult } from '@ngbase/adk/test';
import { NumberOnly } from './number-only';

describe('NumberOnly Directive', () => {
  let component: TestComponent;
  let view: RenderResult<TestComponent>;
  let input: ElementHelper<HTMLInputElement>;

  @Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NumberOnly],
    template: `<input ngbNumberOnly [min]="min()" [max]="max()" [len]="len()" [(value)]="value" />`,
  })
  class TestComponent {
    min = signal<number | undefined>(undefined);
    max = signal<number | undefined>(undefined);
    len = signal<number | undefined>(undefined);
    value = '';
  }

  beforeEach(async () => {
    view = await render(TestComponent);
    component = view.host;
    view.detectChanges();
    input = view.$('input');
  });

  it('should create an instance', () => {
    const directive = view.viewChild(NumberOnly);
    expect(directive).toBeTruthy();
  });

  it('should allow numeric input', () => {
    input.type('123');
    expect(input.el.value).toBe('123');
  });

  it('should not allow non-numeric input', () => {
    input.type('a');
    expect(input.el.value).toBe('');
  });

  it('should allow backspace', () => {
    input.type('123');
    const event = input.keydown('Backspace');
    expect(event.defaultPrevented).toBeFalsy();
  });

  it('should allow arrow keys', () => {
    for (const key of ['ArrowLeft', 'ArrowRight', 'Home', 'End']) {
      const event = input.keydown(key);
      expect(event.defaultPrevented).toBeFalsy();
    }
  });

  it('should prevent Ctrl+V', () => {
    const event = input.keydown('v', { ctrlKey: true });
    expect(event.defaultPrevented).toBeTruthy();
  });

  it('should allow Ctrl+A, Ctrl+C, Ctrl+X', () => {
    for (const key of ['a', 'c', 'x']) {
      const event = input.keydown(key, { ctrlKey: true });
      expect(event.defaultPrevented).toBeFalsy();
    }
  });

  it('should respect min value', () => {
    component.min.set(10);
    view.detectChanges();

    // Now try to type a value that would go below min
    input.type('0');
    expect(input.el.value).toBe(''); // Should not allow '0' to be typed

    input.type('5');
    expect(input.el.value).toBe('5');

    // Simulate typing another '5' (which would make it 55, above min)
    input.type('5');
    expect(input.el.value).toBe('55');
  });

  it('should respect max value', () => {
    component.max.set(100);
    view.detectChanges();

    input.type('9911'); // Try to type '9911', which would exceed max
    expect(input.el.value).toBe('99'); // Should not allow '1' to be typed
  });

  it('should increment value on ArrowUp', () => {
    input.type('5');
    input.keydown('ArrowUp');
    expect(component.value).toBe('06');
  });

  it('should decrement value on ArrowDown', () => {
    input.type('5');
    input.keydown('ArrowDown');
    expect(component.value).toBe('04');
  });
});
