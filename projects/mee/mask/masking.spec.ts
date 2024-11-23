import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ElementHelper, render, RenderResult } from '@meeui/adk/test';
import { MaskInput } from './masking';

@Component({
  imports: [MaskInput, FormsModule],
  template: `<input [meeMask]="mask" [(ngModel)]="value" />`,
})
class TestComponent {
  mask = '';
  value = '';
}

describe('MaskInput', () => {
  let component: TestComponent;
  let view: RenderResult<TestComponent>;
  let input: ElementHelper<HTMLInputElement>;
  let animationFrameRequests: Function[] = [];

  beforeEach(async () => {
    view = await render(TestComponent);
    component = view.host;
    input = view.$0('input');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    animationFrameRequests = [];
  });

  async function setMask(mask: string) {
    component.mask = mask;
    await view.whenStable();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply numeric mask correctly', async () => {
    await setMask('###-###-####');

    input.type('1234567890', true);
    expect(input.el.value).toBe('123-456-7890');

    input.type('12345', true);
    expect(input.el.value).toBe('123-45');
  });

  it('should input typing works properly', async () => {
    await setMask('**/*#/#*##');

    input.type('1', true);
    expect(input.el.value).toBe('1');
    input.type('1b', true);
    expect(input.el.value).toBe('1b');
    input.type('1b2', true);
    expect(input.el.value).toBe('1b/2');
    input.type('1b23', true);
    expect(input.el.value).toBe('1b/23');
  });

  it('should apply alphabetic mask correctly', async () => {
    await setMask('aaa-aaa');

    input.type('abcdef', true);
    expect(input.el.value).toBe('abc-def');

    input.type('ab1cd', true);
    expect(input.el.value).toBe('abc-d');
  });

  it('should apply alphanumeric mask correctly', async () => {
    await setMask('***-***');

    input.type('abc123', true);
    expect(input.el.value).toBe('abc-123');

    input.type('ab@cd', true);
    expect(input.el.value).toBe('abc-d');
  });

  it('should handle mask with fixed characters', async () => {
    await setMask('+1 (###) ###-####');

    input.type('1234567890', true);
    expect(input.el.value).toBe('+1 (123) 456-7890');
  });

  it('should handle input longer than mask', async () => {
    await setMask('###-###');

    input.type('1234567890', true);
    expect(input.el.value).toBe('123-456');
  });

  it('should handle partial input', async () => {
    await setMask('(###) ###-####');

    input.type('123', true);
    expect(input.el.value).toBe('(123');
  });

  it('should handle deletion of characters', async () => {
    await setMask('###-###-####');

    input.type('123-456-7890', true);
    expect(input.el.value).toBe('123-456-7890');

    input.type('123-456-789', true);
    expect(input.el.value).toBe('123-456-789');
  });

  it('should handle writeValue correctly', async () => {
    await setMask('###-###-####');

    input.type('1234567890', true);
    expect(input.el.value).toBe('123-456-7890');

    input.type('', true);
    expect(input.el.value).toBe('');
  });

  it('should handle different mask characters', async () => {
    await setMask('#a*-#a*');

    input.type('1b2-3c4', true);
    expect(input.el.value).toBe('1b2-3c4');

    input.type('1bc-3de', true);
    expect(input.el.value).toBe('1bc-3de');
  });
});
