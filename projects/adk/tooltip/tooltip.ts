import { animate, state, style, transition, trigger } from '@angular/animations';
import { Directive, ElementRef, OnDestroy, afterRenderEffect, inject, signal } from '@angular/core';
import { POPOVER_ARROW_TRACKER, PopoverPosition, tooltipPosition } from '@ngbase/adk/popover';

export const tooltipAnimation = trigger('tooltipAnimation', [
  state('1', style({ transform: 'none', opacity: 1 })),
  state('void', style({ transform: 'translateY(-5px) scale(0.95)', opacity: 0 })),
  state('0', style({ transform: 'translateY(-5px) scale(0.95)', opacity: 0 })),
  transition('* => *', animate('150ms ease-out')),
]);

@Directive({
  selector: '[ngbTooltip]',
  host: {
    '[@tooltipAnimation]': '',
  },
})
export class NgbTooltipTemplate implements OnDestroy {
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly arrowTracker = inject(POPOVER_ARROW_TRACKER, { optional: true });

  readonly content = signal('Tooltip');
  private target = signal<HTMLElement | undefined>(undefined);
  private position: PopoverPosition = 'top';
  private hide!: VoidFunction;
  private observer?: MutationObserver;

  constructor() {
    afterRenderEffect(() => {
      const _ = this.content();
      const target = this.target();
      // we need for the content to be set before setting the position
      if (target) {
        this.setPosition(target);
      }
    });
  }

  update(content: string, target: HTMLElement, position: PopoverPosition, hide: VoidFunction) {
    this.setTarget(target);
    this.hide = hide;
    this.position = position;
    this.el.nativeElement.style.right = '';
    this.el.nativeElement.style.transition = '.15s ease-out all';
    this.content.set(content);
  }

  private setTarget(target: HTMLElement) {
    this.ngOnDestroy();
    this.target.set(target);
    this.listenTarget();
  }

  private listenTarget() {
    this.observer = new MutationObserver(() => {
      const target = this.target();
      if (target?.isConnected) {
        this.setPosition(target);
      } else {
        this.onRemoved();
      }
    });

    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  private onRemoved = () => {
    this.hide();
  };

  setPosition(target: HTMLElement) {
    const el = this.el.nativeElement;

    const { top, bottom, left, right, position } = tooltipPosition({
      target,
      el,
      position: this.position,
      offset: 8,
    });
    if (bottom != undefined) {
      el.style.bottom = `${bottom}px`;
    } else {
      el.style.top = `${top}px`;
    }
    if (right != undefined) {
      el.style.right = `${right}px`;
    } else {
      el.style.left = `${left}px`;
    }
    this.arrowTracker?.values.set({ top, bottom, left, right, target, position });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
