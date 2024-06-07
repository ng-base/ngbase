import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewContainerRef,
  afterNextRender,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  BaseDialog,
  DialogOptions,
  DialogPosition,
  tooltipPosition,
} from '../portal';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  EMPTY,
  Observable,
  debounceTime,
  fromEvent,
  map,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { OverlayConfig } from '../portal/utils';

@Component({
  selector: 'mee-popover',
  standalone: true,
  imports: [],
  template: ` <div
      #container
      class="menu-container pointer-events-auto fixed z-10 rounded-base border bg-foreground p-b shadow-md"
      [class]="[
        tooltipOptions.anchor ? 'popover-anchor' : 'overflow-auto',
        tooltipOptions.className
      ]"
      [@slideInOutAnimation]="status() ? 1 : 0"
      (@slideInOutAnimation.done)="animationDone()"
    >
      <ng-container #myDialog></ng-container>
    </div>
    @if (options.backdrop) {
      <div
        #backdropElement
        class="pointer-events-auto fixed top-0 h-full w-full"
        [style.clipPath]="tooltipOptions.clipPath?.()"
        [class]="tooltipOptions.backdropClassName"
        (click)="!options.disableClose && close()"
      ></div>
    }`,
  host: {
    class: 'fixed top-0 left-0 w-full h-full pointer-events-none',
  },
  styles: [
    `
      .popover-anchor {
        --action-angle: 180deg;
        --action-left: 50%;
        --action-top: -1rem;
      }
      .popover-anchor::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-style: solid;
        border-top: 1rem solid;
        @apply border-foreground;
        border-left: 1rem solid transparent;
        border-right: 1rem solid transparent;
        top: var(--action-top);
        left: var(--action-left);
        transform: translateX(-50%) rotate(var(--action-angle, 180deg));
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOutAnimation', [
      state('1', style({ transform: 'none', opacity: 1 })),
      state(
        'void',
        style({ transform: 'translateY(-10px) scale(0.95)', opacity: 0 }),
      ),
      state(
        '0',
        style({ transform: 'translateY(-10px) scale(0.95)', opacity: 0 }),
      ),
      transition('* => *', animate('100ms ease-out')),
    ]),
  ],
})
export class Popover extends BaseDialog implements OnDestroy {
  myDialog = viewChild('myDialog', { read: ViewContainerRef });
  container = viewChild<ElementRef<HTMLElement>>('container');
  backdropElement = viewChild<ElementRef<HTMLElement>>('backdropElement');
  private document = inject(DOCUMENT);
  options!: DialogOptions;
  tooltipOptions!: OverlayConfig;
  private lastPosition: DialogPosition = 'top';
  scrolled = signal(0);

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
    });

    effect(() => {
      const el = this.container()!.nativeElement;
      const target = this.target() || this.tooltipOptions.target;
      if (this.tooltipOptions.anchor) {
        this.tooltipOptions.offset = 16;
      }
      this.lastPosition = this.tooltipOptions.position || 'bottom';
      // this.schedulePopoverUpdate(target, el);
      if (this.tooltipOptions.smoothScroll) {
        // target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // fromEvent(window, 'scroll')
        //   .pipe(
        //     startWith(1),
        //     tap((x) => console.count('scroll 50')),
        //     debounceTime(50),
        //     take(1),
        //   )
        //   .subscribe(() => {});
        // fromEvent(window, 'scroll')
        //   .pipe(
        //     startWith(1),
        //     tap((x) => console.count('scroll 10')),
        //     debounceTime(10),
        //     take(1),
        //   )
        //   .subscribe(() => {
        //     this.scrolled.update((x) => x + 1);
        //     this.schedulePopoverUpdate(target, el);
        //   });
        scrollToElement(target).then(() => {
          this.scrolled.update((x) => x + 1);
          this.schedulePopoverUpdate(target, el);
        });
      } else {
        this.schedulePopoverUpdate(target, el);
      }
    });
  }

  private scheduleUpdateDimension = () => {
    requestAnimationFrame(() => this.updateDimension());
  };

  private schedulePopoverUpdate(target: HTMLElement, el: HTMLElement) {
    this.tooltipOptions.target = target;
    if (this.options.backdrop) {
      this.document.body.style.overflow = 'hidden';
    }
    if (this.options.width === 'target') {
      // update the width of the container to be the same as the target
      el.style.width = `${target.offsetWidth}px`;
    } else if (this.options.width) {
      el.style.width = this.options.width;
    }
    if (this.options.height) {
      el.style.height = this.options.height;
    }
    if (this.options.maxHeight) {
      el.style.maxHeight = this.options.maxHeight;
    }

    this.scheduleUpdateDimension();
    if (!this.options.backdrop) {
      window.addEventListener('wheel', this.scheduleUpdateDimension);
    }
  }

  private updateDimension() {
    const el = this.container()!.nativeElement;
    const target = this.tooltipOptions.target;
    const { top, left, bottom, position } = tooltipPosition({
      target,
      el,
      position: this.lastPosition,
      client: this.tooltipOptions.client,
      offset: this.tooltipOptions.offset,
    });
    // change the anchor position
    if (this.tooltipOptions.anchor) {
      this.updateAnchorPosition(position, el, target);
    }
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
  }

  private updateAnchorPosition(
    position: DialogPosition,
    el: HTMLElement,
    target: HTMLElement,
  ) {
    let deg = '0deg';
    let anchorTop = '50%';
    let anchorLeft = '50%';
    const anchorWidth = 16;

    const thHeight = target.offsetHeight / 2;
    const thWidth = target.offsetWidth / 2;

    switch (position) {
      case 'top':
      case 'tl':
      case 'tr':
        anchorTop = '100%';
        break;
      case 'left':
        deg = '270deg';
        anchorLeft = `calc(100% + ${anchorWidth / 2}px)`;
        anchorTop = thHeight > el.clientHeight ? '50%' : `calc(${thHeight}px)`;
        break;
      case 'right':
        deg = '90deg';
        anchorLeft = `-${anchorWidth / 2}px`;
        anchorTop = thHeight > el.clientHeight ? '50%' : `calc(${thHeight}px)`;
        break;
      case 'bottom':
      case 'bl':
      case 'br':
        deg = '180deg';
        anchorTop = '-1rem';
        anchorLeft =
          thWidth > el.clientWidth ? '50%' : `calc(100% - ${thWidth}px)`;
        break;
    }

    el.style.setProperty('--action-angle', deg);
    el.style.setProperty('--action-left', anchorLeft);
    el.style.setProperty('--action-top', anchorTop);
    // console.log('updateAnchorPosition', position, deg);
  }

  override setOptions(options: DialogOptions): void {
    this.options = options;
  }

  ngOnDestroy(): void {
    window.removeEventListener('wheel', this.scheduleUpdateDimension);
    this.document.body.style.overflow = '';
  }
}

function scrollToElement(target: HTMLElement) {
  return new Promise((resolve, reject) => {
    let lastPos: number;
    let currentPos = null;
    let samePosCount = 0;

    const checkIfScrollComplete = () => {
      currentPos = window.pageYOffset || document.documentElement.scrollTop;

      if (lastPos !== null && currentPos === lastPos) {
        samePosCount++;
        if (samePosCount > 2) {
          resolve(true);
          return;
        }
      } else {
        samePosCount = 0;
        lastPos = currentPos;
      }

      requestAnimationFrame(checkIfScrollComplete);
    };
    // scroll only if the target is not in the view
    // window.scrollTo({
    //   top: target.offsetTop - 50,
    //   behavior: 'smooth',
    // });
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    requestAnimationFrame(checkIfScrollComplete);
  });
}
