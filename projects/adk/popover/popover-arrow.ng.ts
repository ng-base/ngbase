import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  WritableSignal,
} from '@angular/core';
import { InjectionToken } from '@angular/core';
import { PopoverPosition } from './popover.service';

export class PopoverArrowTracker {
  top? = 0;
  left? = 0;
  right? = 0;
  bottom? = 0;
  target?: HTMLElement;
  position?: PopoverPosition;
}

export const POPOVER_ARROW_TRACKER = new InjectionToken<{
  values: WritableSignal<PopoverArrowTracker>;
}>('popoverArrowTracker');

export function providePopoverArrowTracker() {
  return {
    provide: POPOVER_ARROW_TRACKER,
    useFactory: () => ({ values: signal<PopoverArrowTracker>(new PopoverArrowTracker()) }),
  };
}

@Component({
  selector: '[ngbPopoverArrow]',
  template: `
    <ng-content />
    @if (anchor()) {
      <style>
        :host {
          --action-angle: 180deg;
          --action-left: 50%;
          --action-top: -1rem;
        }
        :host::before {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          border-style: solid;
          border-top: 0.5rem solid;
          @apply border-foreground;
          border-left: 0.45rem solid transparent;
          border-right: 0.45rem solid transparent;
          top: var(--action-top);
          left: var(--action-left);
          transform: translateX(-50%) rotate(var(--action-angle, 180deg));
          /* Add shadow to match the container shadow */
          /* filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));
            z-index: -1;  */
        }
      </style>
    }
  `,
  host: {
    '[style]': 'styles()',
  },
})
export class NgbPopoverArrow {
  readonly arrowTracker = inject(POPOVER_ARROW_TRACKER);
  readonly anchor = input(false);
  readonly el = inject(ElementRef<HTMLElement>);
  readonly styles = computed(() => {
    const { target, position } = this.arrowTracker.values();
    if (target && position) {
      return this.updateAnchorPosition(position, target, this.el.nativeElement);
    }
    return {};
  });

  private updateAnchorPosition(position: PopoverPosition, target: HTMLElement, el: HTMLElement) {
    const { height, width, top } = el.getBoundingClientRect();
    const { height: tHeight, width: tWidth, top: tTop } = target.getBoundingClientRect();
    let deg = '0deg';
    let anchorTop = '50%';
    let anchorLeft = '50%';
    const anchorWidth = 8;

    const thHeight = tHeight / 2 - anchorWidth / 2;
    const thWidth = tWidth / 2;

    switch (position) {
      case 'top':
      case 'tl':
      case 'tr':
        anchorTop = '100%';
        break;
      case 'left':
        deg = '270deg';
        anchorLeft = `calc(100% + ${anchorWidth / 2}px)`;
        anchorTop =
          tHeight > height
            ? `calc(50% - ${anchorWidth / 2}px)`
            : `calc(${thHeight + (tTop - top)}px)`;
        break;
      case 'right':
        deg = '90deg';
        anchorLeft = `-${anchorWidth / 2}px`;
        anchorTop =
          tHeight > height
            ? `calc(50% - ${anchorWidth / 2}px)`
            : `calc(${thHeight + (tTop - top)}px)`;
        break;
      case 'bottom':
      case 'bl':
      case 'br':
        deg = '180deg';
        anchorTop = '-0.5rem';
        anchorLeft = thWidth > width ? '50%' : `calc(100% - ${thWidth}px)`;
        break;
    }

    return { '--action-angle': deg, '--action-left': anchorLeft, '--action-top': anchorTop };
  }
}
