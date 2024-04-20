import {
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  output,
} from '@angular/core';
import { Subscription, fromEvent, map, switchMap, takeUntil, tap } from 'rxjs';

export class DragData {
  constructor(
    public x = 0,
    public y = 0,
    public xx = 0,
    public yy = 0,
    public type: 'start' | 'move' | 'end' = 'start',
  ) {}
}

@Directive({
  selector: '[meeDrag]',
  standalone: true,
})
export class DragDirective implements OnDestroy {
  el = inject(ElementRef);
  meeDrag = output<DragData>();
  startEvent!: MouseEvent;
  lastValue = new DragData();
  dragEvent = fromEvent<MouseEvent>(this.el.nativeElement, 'mousedown').pipe(
    switchMap((event) => {
      this.startEvent = event;
      this.lastValue = new DragData();
      this.meeDrag.emit(this.lastValue);
      return fromEvent<MouseEvent>(document, 'mousemove').pipe(
        takeUntil(
          fromEvent(document, 'mouseup').pipe(
            tap(() => {
              this.lastValue = new DragData();
              this.lastValue.type = 'end';
              this.meeDrag.emit(this.lastValue);
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
          );
          return this.lastValue;
        }),
      );
    }),
  );
  subscription!: Subscription;

  constructor() {
    this.subscription = this.dragEvent.subscribe((event) => {
      this.meeDrag.emit(event);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
