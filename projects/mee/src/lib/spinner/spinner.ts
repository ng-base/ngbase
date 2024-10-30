import { Component, input } from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { NgStyle } from '@angular/common';

const spinnerAnimation = trigger('enterLeave', [
  transition(':enter', [
    animate(
      '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      keyframes([
        style({ opacity: 0, transform: 'scale(0)', offset: 0 }),
        style({ opacity: 1, transform: 'scale(1.5)', offset: 0.7 }),
        style({ opacity: 1, transform: 'scale(1)', offset: 1 }),
      ]),
    ),
  ]),
  transition(':leave', [
    animate(
      '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      keyframes([
        style({ opacity: 1, transform: 'scale(1)', offset: 0 }),
        style({ opacity: 1, transform: 'scale(1.5)', offset: 0.3 }),
        style({ opacity: 0, transform: 'scale(0)', offset: 1 }),
      ]),
    ),
  ]),
]);

@Component({
  standalone: true,
  selector: 'mee-spinner',
  template: `
    <ng-content />
    <!-- <div
      class="aspect-square w-full animate-spin rounded-full border-primary border-l-transparent"
      [class]="mode()"
      [style.border-width.px]="strokeWidth()"
      [style.width.px]="diameter()"
    ></div> -->
    <div
      class="spinner"
      [style]="{
        width: diameter() + 'px',
        height: diameter() + 'px',
      }"
    >
      <svg viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r="20"
          [style.strokeWidth.px]="strokeWidth()"
          stroke-dasharray="88 38"
          stroke-linecap="round"
          class="fill-none stroke-current"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="1s"
            values="0 25 25;360 25 25"
          />
        </circle>
      </svg>
    </div>
  `,
  host: {
    class: 'inline-flex items-center justify-center transition-all duration-300 text-primary',
    '[class]': `root() ? 'fixed inset-0 z-p bg-foreground bg-opacity-60 backdrop-blur-sm' : 'relative'`,
  },
  animations: [
    // animation for entering and exiting, with a bouncy effect
    spinnerAnimation,
  ],
})
export class Spinner {
  readonly mode = input<'light' | 'dark' | ''>('light');
  readonly diameter = input<number>(35);
  readonly strokeWidth = input<any>(3);
  readonly root = input<boolean>(false);
}
