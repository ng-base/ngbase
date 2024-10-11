import { Component, signal, viewChild } from '@angular/core';
import { render, RenderResult } from '../test';
import { Drag, DragData } from './drag';

// Mock PointerEvent
class MockPointerEvent extends Event {
  clientX: number;
  clientY: number;
  button: number = 0;

  constructor(type: string, init?: { clientX?: number; clientY?: number; button?: number }) {
    super(type);
    this.clientX = init?.clientX || 0;
    this.clientY = init?.clientY || 0;
    this.button = init?.button || 0;
  }
}

@Component({
  standalone: true,
  imports: [Drag],
  template: `
    <div class="parent" style="width: 100px; height: 100px; background: red;">
      <div class="child" meeDrag [dragBoundary]="dragBoundary()" (meeDrag)="onDrag($event)">
        Drag me
      </div>
    </div>
  `,
})
class TestComponent {
  dragData: DragData | null = null;
  dragBoundary = signal('');
  drag = viewChild.required(Drag);
  onDrag(data: DragData) {
    this.dragData = data;
  }
}

describe('Drag Directive', () => {
  let component: TestComponent;
  let view: RenderResult<TestComponent>;
  let dragElement: HTMLElement;

  beforeEach(async () => {
    view = await render(TestComponent);
    component = view.host;
    dragElement = view.$(Drag);
    view.detectChanges();
  });

  function triggerEvent(
    eventName: 'pointerdown' | 'pointermove' | 'pointerup',
    eventInit: PointerEventInit = {},
  ) {
    const event = new MockPointerEvent(eventName, eventInit);
    if (eventName === 'pointerdown') {
      dragElement.dispatchEvent(event);
    } else {
      document.dispatchEvent(event);
    }
  }

  it('should create an instance', () => {
    const directive = view.viewChild(Drag);
    expect(directive).toBeTruthy();
  });

  it('should set touch-action to none', () => {
    expect(dragElement.style.touchAction).toBe('none');
  });

  it('should emit start event on pointerdown', () => {
    triggerEvent('pointerdown', { clientX: 100, clientY: 100 });
    view.detectChanges();

    expect(component.dragData).toBeTruthy();
    expect(component.dragData?.type).toBe('start');
    expect(component.dragData?.x).toBe(0);
    expect(component.dragData?.y).toBe(0);
  });

  it('should not call startDrag if not left click', () => {
    triggerEvent('pointerdown', { clientX: 100, clientY: 100, button: 2 });
    expect(component.dragData).toBeNull();

    triggerEvent('pointerdown', { clientX: 100, clientY: 100, button: 0 });
    expect(component.dragData).toBeTruthy();
  });

  it('should emit move events on pointermove', () => {
    triggerEvent('pointerdown', { clientX: 100, clientY: 100 });

    triggerEvent('pointermove', { clientX: 150, clientY: 150 });
    view.detectChanges();

    expect(component.dragData).toBeTruthy();
    expect(component.dragData?.type).toBe('move');
    expect(component.dragData?.x).toBe(50);
    expect(component.dragData?.y).toBe(50);
  });

  it('should emit end event on pointerup', () => {
    triggerEvent('pointerdown', { clientX: 100, clientY: 100 });

    triggerEvent('pointermove', { clientX: 150, clientY: 150 });

    triggerEvent('pointerup', { clientX: 200, clientY: 200 });
    view.detectChanges();

    expect(component.dragData).toBeTruthy();
    expect(component.dragData?.type).toBe('end');
    expect(component.dragData?.x).toBe(100);
    expect(component.dragData?.y).toBe(100);
  });

  describe('drag boundary', () => {
    function initDrag() {
      component.dragBoundary.set('.parent');
      view.detectChanges();
      const parent = view.$('.parent');
      jest.spyOn(parent, 'getBoundingClientRect').mockReturnValue({
        left: 50,
        top: 50,
        right: 100,
        bottom: 100,
        width: 500,
        height: 1000,
      } as DOMRect);
      const el = view.$('.child');
      jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({
        left: 100,
        top: 100,
        right: 100,
        bottom: 100,
        width: 50,
        height: 50,
      } as DOMRect);
    }

    it('should handle drag boundary', () => {
      initDrag();
      triggerEvent('pointerdown', { clientX: 110, clientY: 110 });
      view.detectChanges();
      const drag = component.drag();
      expect(drag['boundaryRect']).toEqual({
        left: 50,
        top: 50,
        right: 400,
        bottom: 900,
      });

      triggerEvent('pointermove', { clientX: 40, clientY: 40 });
      expect(drag.lastValue.x).toBe(-50);
      expect(drag.lastValue.y).toBe(-50);

      triggerEvent('pointermove', { clientX: 600, clientY: 1100 });
      expect(drag.lastValue.x).toBe(400);
      expect(drag.lastValue.y).toBe(900);
    });
  });

  it('should calculate direction correctly', () => {
    triggerEvent('pointerdown', { clientX: 100, clientY: 100 });

    triggerEvent('pointermove', { clientX: 150, clientY: 100 });
    view.detectChanges();

    expect(component.dragData?.direction).toBe('right');

    triggerEvent('pointermove', { clientX: 50, clientY: 100 });
    view.detectChanges();

    expect(component.dragData?.direction).toBe('left');
  });

  it('should calculate velocity', () => {
    jest.useFakeTimers();
    triggerEvent('pointerdown', { clientX: 100, clientY: 100 });

    jest.advanceTimersByTime(100); // Simulate 100ms passing

    triggerEvent('pointermove', { clientX: 200, clientY: 200 });
    view.detectChanges();

    expect(component.dragData?.velocity).toBeGreaterThan(0);

    jest.useRealTimers();
  });

  it('should toggle user-select style', () => {
    triggerEvent('pointerdown', { clientX: 100, clientY: 100 });
    expect(document.body.style.userSelect).toBe('none');

    triggerEvent('pointerup', { clientX: 200, clientY: 200 });
    expect(document.body.style.userSelect).toBe('');
  });
});
