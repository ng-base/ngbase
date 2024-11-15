import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterRenderEffect,
  inject,
  signal,
} from '@angular/core';
import { PopoverPosition, tooltipPosition } from '@meeui/ui/popover';
import { ThemeService } from '@meeui/ui/theme';

@Component({
  selector: 'mee-tooltip',
  template: `{{ content() }}`,
  styles: ``,
  host: {
    class:
      'fixed inline-block rounded-base bg-foreground px-b3 py-b border shadow-md z-p whitespace-pre-line max-w-[15rem] text-text',
    '[class]': `theme.mode() === 'dark' ? 'light' : 'dark'`,
    '[@slideInOutAnimation]': '1',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOutAnimation', [
      state('1', style({ transform: 'none', opacity: 1 })),
      state('void', style({ transform: 'translateY(-5px) scale(0.95)', opacity: 0 })),
      state('0', style({ transform: 'translateY(-5px) scale(0.95)', opacity: 0 })),
      transition('* => *', animate('150ms ease-out')),
    ]),
  ],
})
export class TooltipComponent implements OnDestroy {
  content = signal('Tooltip');
  theme = inject(ThemeService);
  target!: HTMLElement;
  el = inject<ElementRef<HTMLElement>>(ElementRef);
  position: PopoverPosition = 'top';
  hide!: VoidFunction;
  observer?: MutationObserver;

  constructor() {
    afterRenderEffect(() => {
      const _ = this.content();
      // we need for the content to be set before setting the position
      this.setPosition(this.target);
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
    this.target = target;
    this.listenTarget();
  }

  private listenTarget() {
    this.observer = new MutationObserver(() => {
      if (this.target.isConnected) {
        this.setPosition(this.target);
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

    const { top, bottom, left, right } = tooltipPosition({
      target,
      el,
      position: this.position,
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
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
