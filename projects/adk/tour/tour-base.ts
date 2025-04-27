import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { PopoverOptions, PopoverPosition, tooltipPosition } from '@ngbase/adk/popover';
import { BaseDialog, DialogOptions } from '@ngbase/adk/portal';
import { debounceTime, fromEvent, startWith, take } from 'rxjs';
import { NgbTourService } from './tour.service';
import { tourAnimation } from './animation';

@Component({
  selector: '[ngbTour]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #container
      class="pointer-events-auto fixed z-10 overflow-auto rounded-md border bg-background p-1 shadow-md"
      [@slideInOutAnimation]
    >
      <ng-container #myDialog />
    </div>
    <div class="pointer-events-auto fixed top-0 h-full w-full bg-black/20" [@fadeAnimation]></div>
  `,
  host: {
    '[@parentAnimation]': '',
    '(@parentAnimation.done)': 'animationDone()',
  },
  animations: [tourAnimation],
})
export class NgbBaseTour extends BaseDialog implements OnDestroy {
  readonly tourService = inject(NgbTourService);
  readonly myDialog = viewChild('myDialog', { read: ViewContainerRef });
  readonly container = viewChild<ElementRef<HTMLElement>>('container');

  options!: DialogOptions;
  tooltipOptions!: PopoverOptions;
  private lastPosition: PopoverPosition = 'top';
  readonly scrolled = signal(0);

  readonly clipPath = computed(() => {
    const _ = this.scrolled();
    const currentStep = this.tourService.currentStep()!;
    const { width, height, top, left } = currentStep.el.nativeElement.getBoundingClientRect();
    return `polygon(
      0 0,
      100% 0,
      100% ${top}px,
      ${left}px ${top}px,
      ${left}px ${top + height}px,
      ${left + width}px ${top + height}px,
      ${left + width}px ${top}px,
      100% ${top}px,
      100% 100%,
      0 100%,
      0 0
    )`;
  });

  constructor() {
    super();
    setTimeout(() => {
      this._afterViewSource.next(this.myDialog()!);
      this.container()!.nativeElement.classList.add('transition-all');
    }, 5000);
    // (() => {

    //   // setTimeout(() => {
    //   // }, 1000);
    // });

    effect(() => {
      const target = this.target() || this.tooltipOptions.target;
      this.tooltipOptions.target = target;
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      fromEvent(window, 'scroll')
        .pipe(startWith(1), debounceTime(50), take(1))
        .subscribe(() => {
          this.lastPosition = this.tooltipOptions.position || 'bottom';
          const el = this.container()!.nativeElement;
          if (this.options.backdrop) {
            this.document.body.style.overflow = 'hidden';
          }
          if (this.options.width === 'target') {
            // update the width of the container to be the same as the target
            el.style.width = `${this.tooltipOptions.target.offsetWidth}px`;
          } else if (this.options.width) {
            el.style.width = this.options.width;
          }
          if (this.options.height) {
            el.style.height = this.options.height;
          }
          if (this.options.maxHeight) {
            el.style.maxHeight = this.options.maxHeight;
          }
          this.scrolled.update(x => x + 1);
          this.updateDimension();
        });
      // if (!this.options.backdrop) {
      //   // window.addEventListener('wheel', this.updateDimension);
      // }
    });
  }

  private updateDimension = () => {
    requestAnimationFrame(() => {
      const el = this.container()!.nativeElement;
      const { top, left, bottom, position } = tooltipPosition({
        target: this.tooltipOptions.target,
        el,
        position: this.lastPosition,
        client: this.tooltipOptions.client,
        offset: this.tooltipOptions.offset,
      });
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
