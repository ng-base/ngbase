import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  ViewContainerRef,
  afterNextRender,
  effect,
  inject,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { FocusTrap } from '@ngbase/adk/a11y';
import { BaseDialog, NgbPortalClose } from '@ngbase/adk/portal';
import { createHostAnimation, disposals } from '@ngbase/adk/utils';
import { EMPTY, Observable, fromEvent, map, startWith, switchMap } from 'rxjs';
import { PopoverOptions, PopoverPosition } from './popover.service';
import { tooltipPosition } from './utils';

@Directive({
  selector: '[ngbPopoverBackdrop]',
  hostDirectives: [FocusTrap],
  host: {
    '[style.clipPath]': 'popover.options().clipPath?.()',
    '[class]': 'popover.options().backdropClassName',
    '(click)': '!popover.options().disableClose && popover.close()',
  },
})
export class NgbPopoverBackdrop {
  readonly popover = inject(NgbPopover);
  readonly focusTrap = inject(FocusTrap);

  constructor() {
    this.focusTrap._focusTrap = linkedSignal(() => this.popover.options().focusTrap ?? true);
  }
}

@Directive({
  selector: '[ngbPopoverMain]',
  host: {
    '[class]': 'popover.options().className',
  },
})
export class NgbPopoverMain {
  readonly popover = inject(NgbPopover);
}

@Component({
  selector: 'ngb-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbPopoverBackdrop, NgbPopoverMain],
  template: ` <style>
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
        border-top: 0.8rem solid;
        @apply border-foreground;
        border-left: 0.5rem solid transparent;
        border-right: 0.5rem solid transparent;
        top: var(--action-top);
        left: var(--action-left);
        transform: translateX(-50%) rotate(var(--action-angle, 180deg));
      }
    </style>
    <div
      ngbPopoverMain
      [@slideInOutAnimation]
      class="{{
        'menu-container pointer-events-auto fixed z-10 flex flex-col rounded-lg border bg-foreground shadow-md ' +
          (options().anchor ? 'popover-anchor ' : 'overflow-auto ')
      }}"
    >
      <div class="flex flex-1 flex-col overflow-auto">
        <ng-container #myDialog />
      </div>
    </div>
    @if (options().backdrop) {
      <div
        ngbPopoverBackdrop
        class="popover-backdrop pointer-events-auto fixed top-0 h-full w-full"
      ></div>
    }`,
  host: {
    class:
      'fixed top-0 left-0 w-full h-full pointer-events-none z-p flex items-center justify-center',
    '[@parentAnimation]': '',
    '(@parentAnimation.done)': 'animationDone()',
  },
  animations: [
    createHostAnimation(['@slideInOutAnimation']),
    trigger('slideInOutAnimation', [
      state('1', style({ transform: 'none', opacity: 1 })),
      state('void', style({ transform: 'translateY(-10px) scale(0.95)', opacity: 0 })),
      state('0', style({ transform: 'translateY(-10px) scale(0.95)', opacity: 0 })),
      transition('* => *', animate('100ms ease-out')),
    ]),
  ],
})
export class NgbPopover extends BaseDialog {
  private readonly disposals = disposals();

  readonly myDialog = viewChild.required('myDialog', { read: ViewContainerRef });
  readonly container = viewChild.required<NgbPopoverMain, ElementRef<HTMLElement>>(NgbPopoverMain, {
    read: ElementRef,
  });
  readonly backdropElement = viewChild<NgbPopoverBackdrop, ElementRef<HTMLElement>>(
    NgbPopoverBackdrop,
    { read: ElementRef },
  );

  readonly options = signal<PopoverOptions>({} as PopoverOptions);
  private lastPosition: PopoverPosition = 'top';
  readonly scrolled = signal(0);

  readonly events: Observable<{ type: string; value: any }> = this._afterViewSource.pipe(
    switchMap(e => {
      const el = this.container()!.nativeElement;
      const mouseenter = fromEvent(el, 'mouseenter');
      const mouseleave = fromEvent(el, 'mouseleave');
      const event = mouseenter.pipe(
        switchMap(e =>
          mouseleave.pipe(
            map(x => ({ type: 'mouseleave', value: x })),
            startWith({ type: 'mouseenter', value: e }),
          ),
        ),
      );
      return e ? event : EMPTY;
    }),
  );

  constructor() {
    super();

    const dialog = effect(() => {
      this._afterViewSource.next(this.myDialog()!);
      dialog.destroy();
    });

    effect(cleanup => {
      const el = this.container()!.nativeElement;
      const options = this.options();
      const target = this.getTarget();
      if (options.anchor) {
        options.offset = 16;
      }
      this.lastPosition = options.position || 'bottom';
      // this.schedulePopoverUpdate(target, el);
      if (options.smoothScroll) {
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
          this.scrolled.update(x => x + 1);
          this.schedulePopoverUpdate(target, el, options);
        });
      } else {
        this.schedulePopoverUpdate(target, el, options);
      }

      // TODO: remove this once we have multi cleanup support
      if (!options.backdrop) {
        window.addEventListener('scroll', this.scheduleUpdateDimension);
        cleanup(() => window.removeEventListener('scroll', this.scheduleUpdateDimension));
      }

      // observe the target element position change
      const resizeObserver = new ResizeObserver(() => {
        // console.log('resizeObserver');
        this.schedulePopoverUpdate(target, el, options);
      });
      resizeObserver.observe(target);
      cleanup(() => resizeObserver.disconnect());
    });
  }

  override getTarget(): HTMLElement {
    return this.target() || this.options().target;
  }

  private scheduleUpdateDimension = () => {
    this.disposals.afterNextRender(() => this.updateDimension());
  };

  private schedulePopoverUpdate(target: HTMLElement, el: HTMLElement, options: PopoverOptions) {
    // this.options().target = target;
    // if (options.backdrop) {
    //   this.onOpen();
    // }
    if (options.width === 'target') {
      // update the width of the container to be the same as the target
      el.style.width = `${target.offsetWidth}px`;
    } else if (options.width === 'free') {
      el.style.minWidth = `${target.offsetWidth}px`;
    } else if (options.width) {
      el.style.width = options.width;
    }
    if (options.height) {
      el.style.height = options.height;
    }
    if (options.maxHeight) {
      el.style.maxHeight = options.maxHeight;
    }

    this.scheduleUpdateDimension();
  }

  private updateDimension() {
    const el = this.container()!.nativeElement;
    const target = this.getTarget();
    if (!target) {
      return;
    }
    const { top, bottom, left, right, position, maxHeight, maxWidth } = tooltipPosition({
      target,
      el,
      position: this.lastPosition,
      client: this.options().client,
      offset: this.options().offset,
      sideOffset: this.options().sideOffset,
    });
    // change the anchor position
    if (this.options().anchor) {
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
    if (right != undefined) {
      el.style.right = `${right}px`;
      el.style.left = '';
    } else {
      el.style.left = `${left}px`;
      el.style.right = '';
    }

    if (maxHeight) {
      el.style.maxHeight = `${maxHeight}px`;
    }
    if (maxWidth) {
      el.style.maxWidth = `${maxWidth}px`;
    }
  }

  private updateAnchorPosition(position: PopoverPosition, el: HTMLElement, target: HTMLElement) {
    let deg = '0deg';
    let anchorTop = '50%';
    let anchorLeft = '50%';
    const anchorWidth = 12.8;

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
        anchorLeft = thWidth > el.clientWidth ? '50%' : `calc(100% - ${thWidth}px)`;
        break;
    }

    el.style.setProperty('--action-angle', deg);
    el.style.setProperty('--action-left', anchorLeft);
    el.style.setProperty('--action-top', anchorTop);
    // console.log('updateAnchorPosition', position, deg);
  }

  override setOptions(options: PopoverOptions): void {
    // console.log('setOptions', options);
    this.options.set(options);
  }
}

function scrollToElement(target: HTMLElement) {
  return new Promise(resolve => {
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

@Directive({
  selector: '[ngbPopoverClose]',
  hostDirectives: [{ directive: NgbPortalClose, inputs: ['ngbPortalClose: ngbPopoverClose'] }],
})
export class NgbPopoverClose {}

export function providePopover(popover: typeof NgbPopover) {
  return { provide: NgbPopover, useExisting: popover };
}
