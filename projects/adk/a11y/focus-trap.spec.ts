import { Component, DebugElement, signal } from '@angular/core';
import { render, RenderResult } from '@ngbase/adk/test';
import { FocusTrap } from './focus-trap';

@Component({
  imports: [FocusTrap],
  template: `
    <div [ngbFocusTrap]="enableFocusTrap()">
      <button id="first">First</button>
      <input id="middle" type="text" />
      <button id="last">Last</button>
    </div>
  `,
})
class TestComponent {
  enableFocusTrap = signal(true);
}

describe('FocusTrap', () => {
  let component: TestComponent;
  let view: RenderResult<TestComponent>;
  let directiveElement: DebugElement;
  let directive: FocusTrap;

  beforeEach(async () => {
    view = await render(TestComponent);
    component = view.host;
    directiveElement = view.queryNative(FocusTrap);
    directive = directiveElement.injector.get(FocusTrap);
    view.detectChanges();
  });

  function simulateTab(id: string, shift = false): boolean {
    const element = view.$(id);
    element.focus();
    const tabEvent = element.keydown('Tab', { shiftKey: shift });
    return tabEvent.defaultPrevented;
  }

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should trap focus when tabbing forward from last element', () => {
    const eventPrevented = simulateTab('#last');
    expect(eventPrevented).toBe(true);
    expect(document.activeElement).toBe(view.$('#first').el);
  });

  it('should trap focus when tabbing backward from first element', () => {
    const eventPrevented = simulateTab('#first', true);
    expect(eventPrevented).toBe(true);
    expect(document.activeElement).toBe(view.$('#last').el);
  });

  it('should not interfere with normal tabbing', () => {
    const eventPrevented = simulateTab('#middle');
    expect(eventPrevented).toBe(false);
  });

  it('should update focusable elements when content changes', () => {
    const newButton = document.createElement('button');
    newButton.id = 'new';
    newButton.textContent = 'New Button';
    directiveElement.nativeElement.appendChild(newButton);

    // Manually trigger the update of focusable elements
    directive['setFocusableElements']();

    const eventPrevented = simulateTab('#last');
    expect(eventPrevented).toBe(false);

    // Verify that the new button is now the last focusable element
    expect(directive['lastFocusableElement']).toBe(newButton);
  });

  it('should not trap focus when enableFocusTrap is false', () => {
    const disconnectSpy = jest.spyOn(MutationObserver.prototype, 'disconnect');
    const removeEventListenerSpy = jest.spyOn(
      directiveElement.nativeElement,
      'removeEventListener',
    );

    component.enableFocusTrap.set(false);
    view.detectChanges();

    expect(disconnectSpy).toHaveBeenCalled();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    const eventPrevented = simulateTab('#last');
    expect(eventPrevented).toBe(false);
  });
});
