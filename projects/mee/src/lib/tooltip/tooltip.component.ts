import { trigger, state, style, transition, animate } from '@angular/animations';
import {
  AfterRenderPhase,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  afterRender,
  inject,
  signal,
} from '@angular/core';
import { DialogPosition, tooltipPosition } from '../portal';
import { ThemeService } from '../theme';

@Component({
  selector: 'mee-tooltip',
  standalone: true,
  imports: [],
  template: `{{ content() }}`,
  styles: ``,
  host: {
    class:
      'fixed inline-block rounded-base bg-foreground px-b3 py-b border shadow-md z-150 whitespace-pre-line max-w-[15rem] text-text',
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
export class TooltipComponent {
  content = signal('Tooltip');
  theme = inject(ThemeService);
  target!: HTMLElement;
  el = inject<ElementRef<HTMLElement>>(ElementRef);
  position: DialogPosition = 'top';

  constructor() {
    afterRender(() => {
      this.setPosition(this.target);
    });
  }

  update(content: string, target: HTMLElement, position: DialogPosition) {
    this.target = target;
    this.position = position;
    this.el.nativeElement.style.right = '';
    this.el.nativeElement.style.transition = '.15s ease-out all';
    this.content.set(content);
    this.setPosition(target);
  }

  setPosition(target: HTMLElement) {
    const el = this.el.nativeElement;

    const { top, bottom, left, right } = tooltipPosition({
      target,
      el,
      position: this.position,
    });
    if (top) {
      el.style.top = `${top}px`;
    } else {
      el.style.bottom = `${bottom}px`;
    }
    if (right != undefined) {
      el.style.right = `${right}px`;
    } else {
      el.style.left = `${left}px`;
    }
  }
}
