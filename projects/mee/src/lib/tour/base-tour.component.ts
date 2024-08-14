import {
  ElementRef,
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  OnDestroy,
  afterNextRender,
  viewChild,
  ViewContainerRef,
  effect,
  signal,
} from '@angular/core';
import { TourService } from './tour.service';
import { Button } from '../button';
import { BaseDialog, DialogPosition } from '../portal';
import { OverlayConfig, tooltipPosition } from '../portal/utils';
import { DialogOptions } from '../dialog';
import { DOCUMENT } from '@angular/common';
import { fromEvent, debounce, debounceTime, delay, startWith, take } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { fadeAnimation } from '../dialog/dialog.animation';

@Component({
  standalone: true,
  selector: '[meeTour]',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #container
      class="pointer-events-auto fixed z-10 overflow-auto rounded-md border bg-foreground p-1 shadow-md"
      [@slideInOutAnimation]
    >
      <ng-container #myDialog></ng-container>
    </div>
    <div
      class="pointer-events-auto fixed top-0 h-full w-full bg-black/20"
      [style.clipPath]="clipPath()"
      [@fadeAnimation]
    ></div>
  `,
  animations: [
    trigger('slideInOutAnimation', [
      state('1', style({ transform: 'none', opacity: 1 })),
      state('void', style({ transform: 'translateY(-20px)', opacity: 0 })),
      state('0', style({ transform: 'translateY(-20px)', opacity: 0 })),
      transition('* => *', animate('100ms ease-out')),
    ]),
    fadeAnimation,
  ],
})
export class BaseTour extends BaseDialog implements OnDestroy {
  tourService = inject(TourService);
  myDialog = viewChild('myDialog', { read: ViewContainerRef });
  container = viewChild<ElementRef<HTMLElement>>('container');
  options!: DialogOptions;
  tooltipOptions!: OverlayConfig;
  private lastPosition: DialogPosition = 'top';
  scrolled = signal(0);

  clipPath = computed(() => {
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

    effect(
      () => {
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
      },
      { allowSignalWrites: true },
    );
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
