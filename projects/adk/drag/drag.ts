import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

export class DragData {
  constructor(
    public x = 0,
    public y = 0,
    public dx = 0,
    public dy = 0,
    public type: 'start' | 'move' | 'end' = 'start',
    public event?: PointerEvent,
    public clientX?: number,
    public clientY?: number,
    public direction?: 'left' | 'right',
    public velocity = 0, // pixels per millisecond
    public time = Date.now(),
  ) {}
}

@Directive({
  selector: '[ngbDragHandle]',
  exportAs: 'ngbDragHandle',
  host: {
    class: 'cursor-move',
  },
})
export class DragHandle {}

@Directive({
  selector: '[ngbDrag]',
  exportAs: 'ngbDrag',
})
export class Drag {
  readonly el = inject(ElementRef);
  readonly document = inject(DOCUMENT);

  readonly handle = contentChild(DragHandle, { read: ElementRef, descendants: true });
  readonly events = new Subject<DragData>();
  readonly ngbDrag = outputFromObservable(this.events);

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly lockAxis = input<'x' | 'y'>();
  readonly dragBoundary = input<string>();

  // hacky: we need this for host directives
  _lockAxis = linkedSignal(this.lockAxis);
  _dragBoundary = linkedSignal(this.dragBoundary);
  _disabled = linkedSignal(this.disabled);

  private readonly dragBoundaryElement = computed(() => {
    const id = this._dragBoundary();
    return id ? this.document.querySelector(id) : null;
  });
  private boundaryRect: { left: number; top: number; right: number; bottom: number } | undefined;
  startEvent!: PointerEvent;
  lastValue = new DragData();
  isDragging = false;

  constructor() {
    effect(cleanup => {
      if (!this._disabled()) {
        const handle = this.handle() || this.el;
        handle.nativeElement.addEventListener('pointerdown', this.onPointerDown);
        cleanup(() => handle.nativeElement.removeEventListener('pointerdown', this.onPointerDown));
      }
    });
    this.el.nativeElement.style.touchAction = 'none';
  }

  private onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return; // Only trigger on left click

    this.startDrag(event);
    this.document.addEventListener('pointermove', this.onPointerMove);
    this.document.addEventListener('pointerup', this.onPointerUp);
  };

  private onPointerMove = (event: PointerEvent) => {
    if (this.isDragging) {
      event.preventDefault();
      event.stopPropagation();
      this.moveDrag(event);
    }
  };

  private onPointerUp = (event: PointerEvent) => {
    this.endDrag(event);
    this.document.removeEventListener('pointermove', this.onPointerMove);
    this.document.removeEventListener('pointerup', this.onPointerUp);
  };

  private startDrag(event: PointerEvent) {
    this.startEvent = event;
    this.isDragging = true;
    const rect = this.el.nativeElement.getBoundingClientRect();
    const parentRect = this.dragBoundaryElement()?.getBoundingClientRect();
    if (parentRect) {
      const left = rect.left - parentRect.left;
      const top = rect.top - parentRect.top;
      this.boundaryRect = {
        left,
        top,
        right: parentRect.width - rect.width - left,
        bottom: parentRect.height - rect.height - top,
      };
      // console.log(this.boundaryRect);
    }
    this.lastValue = this.getDragEvent(event, 'start');
    this.events.next(this.lastValue);
    this.toggleUserSelect();
  }

  private moveDrag(event: PointerEvent) {
    this.lastValue = this.getDragEvent(event, 'move');
    // prevent unnecessary events when the drag is outside the boundary
    if (this.lastValue.dx !== 0 || this.lastValue.dy !== 0) {
      this.events.next(this.lastValue);
    }
  }

  private endDrag(event: PointerEvent) {
    this.isDragging = false;
    const value = this.getDragEvent(event, 'end');
    this.events.next(value);
    this.lastValue = new DragData();
    this.toggleUserSelect(false);
  }

  private toggleUserSelect(active = true) {
    const value = active ? 'none' : '';
    this.document.body.style.userSelect = value;
    this.document.body.style.webkitUserSelect = value;
    this.document.body.style.pointerEvents = value;
  }

  private getDirection(ev: PointerEvent) {
    let dir = this.lastValue.direction || 'left';
    if (ev.clientX > this.lastValue.clientX!) {
      dir = 'right';
    } else if (ev.clientX < this.lastValue.clientX!) {
      dir = 'left';
    }
    return dir;
  }

  private getDragEvent(ev: PointerEvent, type: 'start' | 'move' | 'end') {
    const now = Date.now();
    const dt = now - this.lastValue.time;
    const startClientX = this.startEvent.clientX;
    const startClientY = this.startEvent.clientY;

    let x = ev.clientX - startClientX;
    let y = ev.clientY - startClientY;

    // it is to make sure that the drag is always in the drag point
    if (this.boundaryRect) {
      const { left, top, right, bottom } = this.boundaryRect;
      x = Math.max(-left, Math.min(x, right));
      y = Math.max(-top, Math.min(y, bottom));
    }

    if (this._lockAxis() === 'x') {
      y = 0;
    } else if (this._lockAxis() === 'y') {
      x = 0;
    }

    const dx = x - (this.lastValue.x ?? 0);
    const dy = y - (this.lastValue.y ?? 0);

    let velocity = 0;
    if (type === 'move' && dt > 0) {
      const distance = Math.sqrt(dx * dx + dy * dy);
      velocity = (distance / dt) * 0.6;
    } else if (type === 'end') {
      velocity = this.lastValue.velocity;
    }
    this.lastValue.time = now;

    return new DragData(
      x,
      y,
      dx,
      dy,
      type,
      ev,
      ev.clientX,
      ev.clientY,
      this.getDirection(ev),
      velocity,
      now,
    );
  }
}
