import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';

@Component({
  selector: '[meeButton], [meeButton]',
  standalone: true,
  imports: [],
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'inline-flex items-center justify-center rounded-base px-b py-h border font-medium disabled:text-muted disabled:cursor-not-allowed',
    '[class]': `variant() === 'primary'
          ? 'bg-primary text-foreground disabled:bg-background border-primary'
          : variant() === 'secondary'
          ? 'bg-background disabled:bg-background border-background'
          : variant() === 'ghost'
            ? '[&:not(:disabled)]:hover:bg-background [&:not(:disabled)]:active:bg-background/50 border-0'
              : 'border-border text-primary [&:not(:disabled)]:hover:bg-background [&:not(:disabled)]:active:bg-background/50'`,
  },
})
export class Button {
  variant = input<ButtonVariant>('primary');
}
