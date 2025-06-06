import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  Component,
  Directive,
  ElementRef,
  ViewContainerRef,
  effect,
  inject,
  input,
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
import { POPOVER_ARROW_TRACKER, providePopoverArrowTracker } from './popover-arrow.ng';

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
  template: '',
  host: {
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
  readonly arrowTracker = inject(POPOVER_ARROW_TRACKER);
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
    // if (this.options().anchor) {
    // this.updateAnchorPosition(position, el, target);
    // }
    this.lastPosition = position;
    // we need to update the values directly instead of signal to avoid too many CD checks
    if (bottom !== undefined) {
      el.style.bottom = `${bottom}px`;
      el.style.top = '';
    } else {
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
    this.arrowTracker.values.set({ top, bottom, left, right, target, position });
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

@Directive({ selector: '[ngbPopoverClose]' })
export class NgbPopoverClose extends NgbPortalClose {
  readonly ngbPopoverClose = input();

  override close() {
    super.close(this.ngbPopoverClose());
  }
}

export function aliasPopover(popover: typeof NgbPopover) {
  return [{ provide: NgbPopover, useExisting: popover }, providePopoverArrowTracker()];
}
