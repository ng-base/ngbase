import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { render, RenderResult } from '@meeui/ui/test';
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
  let inputElement: HTMLInputElement;
  let animationFrameRequests: Function[] = [];

  beforeEach(async () => {
    // Mock requestAnimationFrame
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback): number => {
        animationFrameRequests.push(() => cb(0));
        return 0;
      });

    view = await render(TestComponent);
    component = view.host;
    inputElement = view.$('input');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    animationFrameRequests = [];
  });

  // Utility function to flush animation frames
  function flushAnimationFrames() {
    while (animationFrameRequests.length) {
      animationFrameRequests.shift()!();
    }
  }

  // Helper function to simulate input event
  function simulateInput(value: string): void {
    inputElement.value = value;
    inputElement.dispatchEvent(new Event('input'));
    view.detectChanges();
    flushAnimationFrames();
  }

  async function setMask(mask: string) {
    component.mask = mask;
    await view.whenStable();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply numeric mask correctly', async () => {
    await setMask('###-###-####');

    simulateInput('1234567890');
    expect(inputElement.value).toBe('123-456-7890');

    simulateInput('12345');
    expect(inputElement.value).toBe('123-45');
  });

  it('should input typing works properly', async () => {
    await setMask('**/*#/#*##');

    simulateInput('1');
    expect(inputElement.value).toBe('1');
    simulateInput('1b');
    expect(inputElement.value).toBe('1b');
    simulateInput('1b2');
    expect(inputElement.value).toBe('1b/2');
    simulateInput('1b23');
    expect(inputElement.value).toBe('1b/23');
  });

  it('should apply alphabetic mask correctly', async () => {
    await setMask('aaa-aaa');

    simulateInput('abcdef');
    expect(inputElement.value).toBe('abc-def');

    simulateInput('ab1cd');
    expect(inputElement.value).toBe('ab');
  });

  it('should apply alphanumeric mask correctly', async () => {
    await setMask('***-***');

    simulateInput('abc123');
    expect(inputElement.value).toBe('abc-123');

    simulateInput('ab@cd');
    expect(inputElement.value).toBe('ab');
  });

  it('should handle mask with fixed characters', async () => {
    await setMask('+1 (###) ###-####');

    simulateInput('1234567890');
    expect(inputElement.value).toBe('+1 (123) 456-7890');
  });

  it('should handle input longer than mask', async () => {
    await setMask('###-###');

    simulateInput('1234567890');
    expect(inputElement.value).toBe('123-456');
  });

  it('should handle partial input', async () => {
    await setMask('(###) ###-####');

    simulateInput('123');
    expect(inputElement.value).toBe('(123');
  });

  it('should handle deletion of characters', async () => {
    await setMask('###-###-####');

    simulateInput('123-456-7890');
    expect(inputElement.value).toBe('123-456-7890');

    simulateInput('123-456-789');
    expect(inputElement.value).toBe('123-456-789');
  });

  it('should handle writeValue correctly', async () => {
    await setMask('###-###-####');

    component.value = '1234567890';
    await view.whenStable();
    flushAnimationFrames();
    expect(inputElement.value).toBe('123-456-7890');

    component.value = '';
    await view.whenStable();
    flushAnimationFrames();
    expect(inputElement.value).toBe('');
  });

  it('should handle different mask characters', async () => {
    await setMask('#a*-#a*');

    simulateInput('1b2-3c4');
    expect(inputElement.value).toBe('1b2-3c4');

    simulateInput('1bc-3de');
    expect(inputElement.value).toBe('1bc-3de');
  });
});
