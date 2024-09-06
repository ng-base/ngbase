import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  NgZone,
  computed,
  contentChild,
  effect,
  inject,
} from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subscription, fromEvent, map, Subject, takeUntil, tap, switchMap, filter } from 'rxjs';

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
  standalone: true,
  selector: '[meeDragHandle]',
  exportAs: 'meeDragHandle',
  host: {
    class: 'cursor-move',
  },
})
export class DragHandle {}

@Directive({
  standalone: true,
  selector: '[meeDrag]',
  exportAs: 'meeDrag',
})
export class Drag {
  readonly el = inject(ElementRef);
  readonly handle = contentChild(DragHandle, { read: ElementRef, descendants: true });
  readonly zone = inject(NgZone);
  readonly document = inject(DOCUMENT);
  readonly events = new Subject<DragData>();
  readonly meeDrag = outputFromObservable(this.events);
  startEvent!: PointerEvent;
  lastValue = new DragData();
  private dragEvent = computed(() => {
    const handle = this.handle();
    console.log(handle);
    if (handle) {
      return this.setupDragEvent(handle.nativeElement);
    }
    return this.setupDragEvent(this.el.nativeElement);
  });

  constructor() {
    effect(cleanup => {
      const dragEvent = this.dragEvent();
      this.zone.runOutsideAngular(() => {
        const subscription = dragEvent.subscribe(event => {
          this.events.next(event);
        });
        cleanup(() => subscription.unsubscribe());
      });
    });
    this.el.nativeElement.style.touchAction = 'none';
  }

  private setupDragEvent(el: HTMLElement) {
    return fromEvent<PointerEvent>(el, 'pointerdown').pipe(
      filter(event => event.button === 0), // Only trigger on left click
      switchMap(event => {
        this.startEvent = event;
        this.lastValue = this.getDragEvent(event, 'start');
        this.events.next(this.lastValue);
        this.toggleUserSelect();
        return fromEvent<PointerEvent>(this.document, 'pointermove').pipe(
          takeUntil(
            fromEvent<PointerEvent>(this.document, 'pointerup').pipe(
              tap(upEvent => {
                const value = this.getDragEvent(upEvent, 'end');
                this.events.next(value);
                this.lastValue = new DragData();
                this.toggleUserSelect(false);
              }),
            ),
          ),
          map(e => {
            this.lastValue = this.getDragEvent(e, 'move');
            return this.lastValue;
          }),
        );
      }),
    );
  }

  private toggleUserSelect(active = true) {
    const value = active ? 'none' : '';
    this.document.body.style.userSelect = value;
    this.document.body.style.webkitUserSelect = value;
  }

  private getDirection(ev: PointerEvent) {
    if (ev.clientX > this.lastValue.clientX!) {
      return 'right';
    } else if (ev.clientX < this.lastValue.clientX!) {
      return 'left';
    }
    return this.lastValue.direction || 'left';
  }

  private getDragEvent(ev: PointerEvent, type: 'start' | 'move' | 'end') {
    const now = Date.now();
    const dt = now - this.lastValue.time;
    const startClientX = this.startEvent.clientX;
    const startClientY = this.startEvent.clientY;
    const dx = ev.clientX - (this.lastValue.clientX ?? startClientX);
    const dy = ev.clientY - (this.lastValue.clientY ?? startClientY);

    let velocity = 0;
    if (type === 'move' && dt > 0) {
      const distance = Math.sqrt(dx * dx + dy * dy);
      velocity = (distance / dt) * 0.6;
    } else if (type === 'end') {
      velocity = this.lastValue.velocity;
    }
    this.lastValue.time = now;

    return new DragData(
      ev.clientX - startClientX,
      ev.clientY - startClientY,
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
