import {
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  output,
} from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subscription, fromEvent, map, switchMap, takeUntil, tap } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

export class DragData {
  constructor(
    public x = 0,
    public y = 0,
    public xx = 0,
    public yy = 0,
    public type: 'start' | 'move' | 'end' = 'start',
    public event?: MouseEvent,
  ) {}
}

@Directive({
  selector: '[meeDrag]',
  standalone: true,
})
export class DragDirective implements OnDestroy {
  el = inject(ElementRef);
  events = new Subject<DragData>();
  meeDrag = outputFromObservable(this.events);
  startEvent!: MouseEvent;
  lastValue = new DragData();
  private dragEvent = fromEvent<MouseEvent>(
    this.el.nativeElement,
    'mousedown',
  ).pipe(
    switchMap((event) => {
      this.startEvent = event;
      this.lastValue = new DragData();
      this.lastValue.event = event;
      this.events.next(this.lastValue);
      return fromEvent<MouseEvent>(document, 'mousemove').pipe(
        takeUntil(
          fromEvent(document, 'mouseup').pipe(
            tap(() => {
              this.lastValue = new DragData();
              this.lastValue.type = 'end';
              this.lastValue.event = event;
              this.events.next(this.lastValue);
            }),
          ),
        ),
        map((e) => {
          e.preventDefault();
          // send the mouse difference between x and y
          this.lastValue = new DragData(
            e.clientX - this.startEvent.clientX,
            e.clientY - this.startEvent.clientY,
            e.clientX - this.startEvent.clientX - this.lastValue.x,
            e.clientY - this.startEvent.clientY - this.lastValue.y,
            'move',
            event,
          );
          return this.lastValue;
        }),
      );
    }),
  );
  subscription!: Subscription;

  constructor() {
    this.subscription = this.dragEvent.subscribe((event) => {
      this.events.next(event);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
