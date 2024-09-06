import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumberOnly } from './number-only.directive';
import { By } from '@angular/platform-browser';

describe('NumberOnly Directive', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: HTMLInputElement;

  @Component({
    standalone: true,
    imports: [NumberOnly],
    template: `<input
      meeNumberOnly
      [min]="min"
      [max]="max"
      [len]="len"
      (valueChanged)="onValueChanged($event)"
    />`,
  })
  class TestComponent {
    min?: number;
    max?: number;
    len?: number;
    value: string = '';

    onValueChanged(value: string) {
      this.value = value;
    }
  }

  function triggerKeyEvent(name: string, key: string, ctrlKey = false) {
    const event = new KeyboardEvent(name, { key, ctrlKey, cancelable: true });
    inputElement.dispatchEvent(event);
    if (event.defaultPrevented) {
      return event;
    }
    inputElement.value += key;
    inputElement.dispatchEvent(new Event('input'));
    return event;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.query(By.directive(NumberOnly));
    expect(directive).toBeTruthy();
  });

  it('should allow numeric input', () => {
    inputElement.value = '123';
    inputElement.dispatchEvent(new Event('input'));
    expect(inputElement.value).toBe('123');
  });

  it('should not allow non-numeric input', () => {
    triggerKeyEvent('keydown', 'a');
    expect(inputElement.value).toBe('');
  });

  it('should allow backspace', () => {
    inputElement.value = '123';
    const event = triggerKeyEvent('keydown', 'Backspace');
    expect(event.defaultPrevented).toBeFalsy();
  });

  it('should allow arrow keys', () => {
    for (const key of ['ArrowLeft', 'ArrowRight', 'Home', 'End']) {
      const event = triggerKeyEvent('keydown', key);
      expect(event.defaultPrevented).toBeFalsy();
    }
  });

  it('should prevent Ctrl+V', () => {
    const event = triggerKeyEvent('keydown', 'v', true);
    expect(event.defaultPrevented).toBeTruthy();
  });

  it('should allow Ctrl+A, Ctrl+C, Ctrl+X', () => {
    for (const key of ['a', 'c', 'x']) {
      const event = triggerKeyEvent('keydown', key, true);
      expect(event.defaultPrevented).toBeFalsy();
    }
  });

  it('should respect min value', () => {
    component.min = 10;
    fixture.detectChanges();

    // Now try to type a value that would go below min
    triggerKeyEvent('keydown', '0');
    expect(inputElement.value).toBe(''); // Should not allow '0' to be typed

    // Simulate typing '5'
    let event = triggerKeyEvent('keydown', '5');
    expect(event.defaultPrevented).toBeFalsy();

    // Simulate typing another '5' (which would make it 55, above min)
    event = triggerKeyEvent('keydown', '5');
    expect(inputElement.value).toBe('55');
  });

  it('should respect max value', () => {
    component.max = 100;
    fixture.detectChanges();

    triggerKeyEvent('keydown', '9');
    triggerKeyEvent('keydown', '9');
    // Try to type '1', which would exceed max
    triggerKeyEvent('keydown', '1');

    expect(inputElement.value).toBe('99'); // Should not allow '1' to be typed
  });

  it('should increment value on ArrowUp', () => {
    inputElement.value = '5';
    const event = triggerKeyEvent('keydown', 'ArrowUp');
    inputElement.dispatchEvent(event);
    expect(component.value).toBe('06');
  });

  it('should decrement value on ArrowDown', () => {
    inputElement.value = '5';
    const event = triggerKeyEvent('keydown', 'ArrowDown');
    inputElement.dispatchEvent(event);
    expect(component.value).toBe('04');
  });
});
