import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Drag, DragData } from './drag.directive';

// Mock PointerEvent
class MockPointerEvent extends Event {
  clientX: number;
  clientY: number;
  button: number = 0;

  constructor(type: string, init?: { clientX?: number; clientY?: number }) {
    super(type);
    this.clientX = init?.clientX || 0;
    this.clientY = init?.clientY || 0;
  }
}

@Component({
  template: '<div meeDrag (meeDrag)="onDrag($event)">Drag me</div>',
})
class TestComponent {
  dragData: DragData | null = null;
  onDrag(data: DragData) {
    this.dragData = data;
  }
}

describe('Drag Directive', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let dragElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [Drag],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    dragElement = fixture.debugElement.query(By.directive(Drag));
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = dragElement.injector.get(Drag);
    expect(directive).toBeTruthy();
  });

  it('should set touch-action to none', () => {
    expect(dragElement.nativeElement.style.touchAction).toBe('none');
  });

  it('should emit start event on pointerdown', () => {
    const event = new MockPointerEvent('pointerdown', { clientX: 100, clientY: 100 });
    dragElement.nativeElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.dragData).toBeTruthy();
    expect(component.dragData?.type).toBe('start');
    expect(component.dragData?.x).toBe(0);
    expect(component.dragData?.y).toBe(0);
  });

  it('should emit move events on pointermove', () => {
    const startEvent = new MockPointerEvent('pointerdown', { clientX: 100, clientY: 100 });
    dragElement.nativeElement.dispatchEvent(startEvent);

    const moveEvent = new MockPointerEvent('pointermove', { clientX: 150, clientY: 150 });
    document.dispatchEvent(moveEvent);
    fixture.detectChanges();

    expect(component.dragData).toBeTruthy();
    expect(component.dragData?.type).toBe('move');
    expect(component.dragData?.x).toBe(50);
    expect(component.dragData?.y).toBe(50);
  });

  it('should emit end event on pointerup', () => {
    const startEvent = new MockPointerEvent('pointerdown', { clientX: 100, clientY: 100 });
    dragElement.nativeElement.dispatchEvent(startEvent);

    const moveEvent = new MockPointerEvent('pointermove', { clientX: 150, clientY: 150 });
    document.dispatchEvent(moveEvent);

    const endEvent = new MockPointerEvent('pointerup', { clientX: 200, clientY: 200 });
    document.dispatchEvent(endEvent);
    fixture.detectChanges();

    expect(component.dragData).toBeTruthy();
    expect(component.dragData?.type).toBe('end');
    expect(component.dragData?.x).toBe(100);
    expect(component.dragData?.y).toBe(100);
  });

  it('should calculate direction correctly', () => {
    const startEvent = new MockPointerEvent('pointerdown', { clientX: 100, clientY: 100 });
    dragElement.nativeElement.dispatchEvent(startEvent);

    const moveRightEvent = new MockPointerEvent('pointermove', { clientX: 150, clientY: 100 });
    document.dispatchEvent(moveRightEvent);
    fixture.detectChanges();

    expect(component.dragData?.direction).toBe('right');

    const moveLeftEvent = new MockPointerEvent('pointermove', { clientX: 50, clientY: 100 });
    document.dispatchEvent(moveLeftEvent);
    fixture.detectChanges();

    expect(component.dragData?.direction).toBe('left');
  });

  it('should calculate velocity', () => {
    jest.useFakeTimers();

    const startEvent = new MockPointerEvent('pointerdown', { clientX: 100, clientY: 100 });
    dragElement.nativeElement.dispatchEvent(startEvent);

    jest.advanceTimersByTime(100); // Simulate 100ms passing

    const moveEvent = new MockPointerEvent('pointermove', { clientX: 200, clientY: 200 });
    document.dispatchEvent(moveEvent);
    fixture.detectChanges();

    expect(component.dragData?.velocity).toBeGreaterThan(0);

    jest.useRealTimers();
  });

  it('should toggle user-select style', () => {
    const startEvent = new MockPointerEvent('pointerdown', { clientX: 100, clientY: 100 });
    dragElement.nativeElement.dispatchEvent(startEvent);
    expect(document.body.style.userSelect).toBe('none');

    const endEvent = new MockPointerEvent('pointerup', { clientX: 200, clientY: 200 });
    document.dispatchEvent(endEvent);
    expect(document.body.style.userSelect).toBe('');
  });
});
