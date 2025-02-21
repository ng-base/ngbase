import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ElementHelper, render, RenderResult } from '@ngbase/adk/test';
import { Mask } from './mask';

@Component({
  imports: [Mask, FormsModule],
  template: `<input [ngbMask]="mask()" [(ngModel)]="value" />`,
})
class TestComponent {
  readonly mask = signal('');
  readonly value = signal('');
}

describe('MaskInput', () => {
  let component: TestComponent;
  let view: RenderResult<TestComponent>;
  let input: ElementHelper<HTMLInputElement>;

  beforeEach(async () => {
    view = await render(TestComponent);
    component = view.host;
    input = view.$('input');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  async function setMask(mask: string) {
    component.mask.set(mask);
    await view.whenStable();
  }

  async function typeValue(value: string) {
    // Clear the input and wait for the view to stabilize
    input.input('');
    await view.whenStable();

    // Type the value character by character, waiting for the view to stabilize after each character
    for (let char of value) {
      input.type(char);
      await view.whenStable();
    }
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply numeric mask correctly', async () => {
    await setMask('###-###-####');

    await typeValue('1234567890');
    expect(input.el.value).toBe('123-456-7890');

    await typeValue('12345');
    expect(input.el.value).toBe('123-45');
  });

  it('should input typing works properly', async () => {
    await setMask('**/*#/#*##');

    await typeValue('1');
    expect(input.el.value).toBe('1');
    await typeValue('1b');
    expect(input.el.value).toBe('1b');
    await typeValue('1b2');
    expect(input.el.value).toBe('1b/2');
    await typeValue('1b23');
    expect(input.el.value).toBe('1b/23');
  });

  it('should apply alphabetic mask correctly', async () => {
    await setMask('aaa-aaa');

    await typeValue('abcdef');
    expect(input.el.value).toBe('abc-def');

    await typeValue('ab1cd');
    expect(input.el.value).toBe('abc-d');
  });

  it('should apply alphanumeric mask correctly', async () => {
    await setMask('***-***');

    await typeValue('abc123');
    expect(input.el.value).toBe('abc-123');

    await typeValue('ab@cd');
    expect(input.el.value).toBe('abc-d');
  });

  it('should handle mask with fixed characters', async () => {
    await setMask('+1 (###) ###-####');

    await typeValue('1234567890');
    expect(input.el.value).toBe('+1 (123) 456-7890');
  });

  it('should handle input longer than mask', async () => {
    await setMask('###-###');

    await typeValue('1234567890');
    expect(input.el.value).toBe('123-456');
  });

  it('should handle partial input', async () => {
    await setMask('(###) ###-####');

    await typeValue('123');
    expect(input.el.value).toBe('(123');
  });

  it('should handle deletion of characters', async () => {
    await setMask('###-###-####');

    await typeValue('123-456-7890');
    expect(input.el.value).toBe('123-456-7890');

    await typeValue('123-456-789');
    expect(input.el.value).toBe('123-456-789');
  });

  it('should handle writeValue correctly', async () => {
    await setMask('###-###-####');

    await typeValue('1234567890');
    expect(input.el.value).toBe('123-456-7890');

    await typeValue('');
    expect(input.el.value).toBe('');
  });

  it('should handle different mask characters', async () => {
    await setMask('#a*-#a*');

    await typeValue('1b2-3c4');
    expect(input.el.value).toBe('1b2-3c4');

    await typeValue('1bc-3de');
    expect(input.el.value).toBe('1bc-3de');
  });
});
