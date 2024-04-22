import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewContainerRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import {
  BaseDialogComponent,
  DialogOptions,
  DialogPosition,
  tooltipPosition,
} from '@meeui/portal';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { EMPTY, Observable, fromEvent, map, startWith, switchMap } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'mee-popover',
  standalone: true,
  imports: [],
  template: ` <div
      #container
      class="pointer-events-auto absolute z-10 overflow-auto rounded-md border bg-white p-1 shadow-md"
      [@slideInOutAnimation]="1"
    >
      <ng-container #myDialog></ng-container>
    </div>
    @if (options.backdrop) {
      <div
        class="pointer-events-auto absolute top-0 h-full w-full"
        (click)="close()"
      ></div>
    }`,
  host: {
    class: 'fixed top-0 left-0 w-full h-full pointer-events-none',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOutAnimation', [
      state('1', style({ transform: 'none', opacity: 1 })),
      state('void', style({ transform: 'translateY(-20px)', opacity: 0 })),
      state('0', style({ transform: 'translateY(-20px)', opacity: 0 })),
      transition('* => *', animate('100ms ease-out')),
    ]),
  ],
})
export class Popover extends BaseDialogComponent implements OnDestroy {
  myDialog = viewChild('myDialog', { read: ViewContainerRef });
  container = viewChild<ElementRef<HTMLElement>>('container');
  vv = inject(ViewContainerRef);
  document = inject(DOCUMENT);
  options!: DialogOptions;
  target!: HTMLElement;
  position: DialogPosition = 'top';
  private lastPosition: DialogPosition = 'top';

  events: Observable<{ type: string; value: any }> = this._afterViewSource.pipe(
    switchMap((e) => {
      const el = this.container()!.nativeElement;
      const mouseenter = fromEvent(el, 'mouseenter');
      const mouseleave = fromEvent(el, 'mouseleave');
      const event = mouseenter.pipe(
        switchMap((e) =>
          mouseleave.pipe(
            map((x) => ({ type: 'mouseleave', value: x })),
            startWith({ type: 'mouseenter', value: e }),
          ),
        ),
      );
      return e ? event : EMPTY;
    }),
  );

  constructor() {
    super();
    afterNextRender(() => {
      this._afterViewSource.next(this.myDialog()!);
      this.lastPosition = this.position;
      const el = this.container()!.nativeElement;
      if (this.options.backdrop) {
        this.document.body.style.overflow = 'hidden';
      }
      if (this.options.width === 'target') {
        // update the width of the container to be the same as the target
        el.style.width = `${this.target.offsetWidth}px`;
      } else if (this.options.width) {
        el.style.width = this.options.width;
      }
      if (this.options.height) {
        el.style.height = this.options.height;
      }
      if (this.options.maxHeight) {
        el.style.maxHeight = this.options.maxHeight;
      }

      this.updateDimension();
      if (!this.options.backdrop) {
        window.addEventListener('wheel', this.updateDimension);
      }
    });
  }

  private updateDimension = () => {
    requestAnimationFrame(() => {
      const el = this.container()!.nativeElement;
      const { top, left, bottom, position } = tooltipPosition(
        this.target,
        el,
        this.lastPosition,
      );
      this.lastPosition = position;
      // we need to update the values directly instead of signal to avoid too many CD checks
      if (bottom) {
        el.style.bottom = `${bottom}px`;
        el.style.top = '';
      } else if (top) {
        el.style.top = `${top}px`;
        el.style.bottom = '';
      }
      el.style.left = `${left}px`;
    });
  };

  override setOptions(options: DialogOptions): void {
    this.options = options;
  }

  ngOnDestroy(): void {
    window.removeEventListener('wheel', this.updateDimension);
    this.document.body.style.overflow = '';
  }
}
