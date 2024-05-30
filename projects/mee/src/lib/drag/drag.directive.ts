import { Directive, ElementRef, OnDestroy, inject } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import {
  Subscription,
  fromEvent,
  map,
  Subject,
  merge,
  takeUntil,
  tap,
  switchMap,
} from 'rxjs';

export class DragData {
  constructor(
    public x = 0,
    public y = 0,
    public xx = 0,
    public yy = 0,
    public type: 'start' | 'move' | 'end' = 'start',
    public event?: MouseEvent | TouchEvent,
    public clientX?: number,
    public clientY?: number,
    public direction?: 'left' | 'right',
    // between 0 and 1
    public velocity = 0,
    public time = Date.now(), // Add the time property
  ) {}
}

@Directive({
  selector: '[meeDrag]',
  standalone: true,
})
export class Drag implements OnDestroy {
  el = inject(ElementRef);
  events = new Subject<DragData>();
  meeDrag = outputFromObservable(this.events);
  startEvent!: MouseEvent | Touch;
  lastValue = new DragData();
  private dragEvent = merge(
    fromEvent<MouseEvent>(this.el.nativeElement, 'mousedown'),
    fromEvent<TouchEvent>(this.el.nativeElement, 'touchstart'),
  ).pipe(
    switchMap((event) => {
      this.startEvent = event instanceof TouchEvent ? event.touches[0] : event;
      // this.lastValue = new DragData();
      // this.lastValue.event = event;
      this.lastValue = this.getDragEvent(event, 'start');
      // this.lastValue.event = event;
      this.events.next(this.lastValue);
      return merge(
        fromEvent<MouseEvent>(document, 'mousemove'),
        fromEvent<TouchEvent>(document, 'touchmove'),
      ).pipe(
        takeUntil(
          merge(
            fromEvent<MouseEvent>(document, 'mouseup'),
            fromEvent<TouchEvent>(document, 'touchend'),
          ).pipe(
            tap(() => {
              const value = this.getDragEvent(this.lastValue.event!, 'end');
              value.velocity = this.lastValue.velocity;
              this.events.next(value);
              this.lastValue = new DragData();
            }),
          ),
        ),
        map((e) => {
          // e.preventDefault();
          this.lastValue = this.getDragEvent(e, 'move');
          return this.lastValue;
        }),
      );
    }),
  );
  subscription!: Subscription;

  constructor() {
    // fromEvent(document, 'touchmove').subscribe((e) => {
    //   console.log(e);
    // });
    this.subscription = this.dragEvent.subscribe((event) => {
      this.events.next(event);
    });
  }

  private getDirection(ev: MouseEvent | Touch) {
    let direction: 'left' | 'right' = 'left';
    if (ev instanceof MouseEvent) {
      const evn = this.lastValue.event as MouseEvent;
      if (ev.clientX > evn?.clientX) {
        direction = 'right';
      } else if (ev.clientX < evn?.clientX) {
        direction = 'left';
      } else {
        direction = this.lastValue.direction || 'left';
      }
    } else if (ev instanceof Touch) {
      const touch = ev;
      const startTouch =
        this.startEvent instanceof TouchEvent
          ? this.startEvent.touches[0]
          : this.startEvent;
      if (touch.clientX > startTouch.clientX) {
        direction = 'right';
      } else if (touch.clientX < startTouch.clientX) {
        direction = 'left';
      } else {
        direction = this.lastValue.direction!;
      }
    }
    return direction;
  }

  private getDragEvent(
    ev: MouseEvent | TouchEvent,
    type: 'start' | 'move' | 'end',
  ) {
    const e = ev instanceof MouseEvent ? ev : ev.touches[0];

    const now = Date.now();
    const timeDifference = now - this.lastValue.time;
    const startClientX = this.startEvent.clientX;
    const startClientY = this.startEvent.clientY;
    const velocityX =
      (e.clientX - startClientX - this.lastValue.x) / timeDifference;
    const velocityY =
      (e.clientY - startClientY - this.lastValue.y) / timeDifference;

    const eClientX = e instanceof MouseEvent ? e.clientX : e.clientX;
    const eClientY = e instanceof MouseEvent ? e.clientY : e.clientY;

    // return new DragData(
    //   e.clientX - this.startEvent.clientX,
    //   e.clientY - this.startEvent.clientY,
    //   e.clientX - this.startEvent.clientX - this.lastValue.x,
    //   e.clientY - this.startEvent.clientY - this.lastValue.y,
    //   type,
    //   e,
    //   this.getDirection(e),
    //   Math.sqrt(velocityX * velocityX + velocityY * velocityY), // Calculate the velocity magnitude
    //   now,
    // );
    return new DragData(
      e instanceof MouseEvent
        ? eClientX - startClientX
        : eClientX - startClientX,
      e instanceof MouseEvent
        ? eClientY - startClientY
        : eClientY - startClientY,
      e instanceof MouseEvent
        ? eClientX - startClientX - this.lastValue.x
        : eClientX - startClientX - this.lastValue.x,
      e instanceof MouseEvent
        ? eClientY - startClientY - this.lastValue.y
        : eClientY - startClientY - this.lastValue.y,
      type,
      ev,
      eClientX,
      eClientY,
      this.getDirection(e),
      Math.sqrt(velocityX * velocityX + velocityY * velocityY), // Calculate the velocity magnitude
      now,
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
