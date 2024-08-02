import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, NgZone, OnDestroy, inject } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subscription, fromEvent, map, Subject, takeUntil, tap, switchMap } from 'rxjs';

export class DragData {
  constructor(
    public x = 0,
    public y = 0,
    public xx = 0,
    public yy = 0,
    public type: 'start' | 'move' | 'end' = 'start',
    public event?: PointerEvent,
    public clientX?: number,
    public clientY?: number,
    public direction?: 'left' | 'right',
    public velocity = 0, // between 0 to 1
    public time = Date.now(),
  ) {}
}

@Directive({
  selector: '[meeDrag]',
  standalone: true,
  exportAs: 'meeDrag',
})
export class Drag implements OnDestroy {
  el = inject(ElementRef);
  zone = inject(NgZone);
  document = inject(DOCUMENT);
  events = new Subject<DragData>();
  meeDrag = outputFromObservable(this.events);
  startEvent!: PointerEvent;
  lastValue = new DragData();
  private dragEvent = fromEvent<PointerEvent>(this.el.nativeElement, 'pointerdown').pipe(
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
              value.velocity = this.lastValue.velocity;
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
  subscription!: Subscription;

  constructor() {
    this.zone.runOutsideAngular(() => {
      this.subscription = this.dragEvent.subscribe(event => {
        this.events.next(event);
      });
    });
    this.el.nativeElement.style.touchAction = 'none';
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
    const timeDifference = now - this.lastValue.time;
    const startClientX = this.startEvent.clientX;
    const startClientY = this.startEvent.clientY;
    const velocityX = (ev.clientX - startClientX - this.lastValue.x) / timeDifference;
    const velocityY = (ev.clientY - startClientY - this.lastValue.y) / timeDifference;

    return new DragData(
      ev.clientX - startClientX,
      ev.clientY - startClientY,
      ev.clientX - startClientX - this.lastValue.x,
      ev.clientY - startClientY - this.lastValue.y,
      type,
      ev,
      ev.clientX,
      ev.clientY,
      this.getDirection(ev),
      Math.sqrt(velocityX * velocityX + velocityY * velocityY),
      now,
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
