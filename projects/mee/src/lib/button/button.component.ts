import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'icon';

@Component({
  standalone: true,
  selector: '[meeButton], [meeButton]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    class:
      'inline-flex items-center justify-center rounded-base px-b4 py-b2 border font-medium disabled:text-muted disabled:cursor-not-allowed',
    '[class]': `variant() === 'primary'
          ? 'bg-primary text-foreground disabled:bg-background border-primary'
          : variant() === 'secondary'
          ? 'bg-muted-background disabled:bg-muted-background border-muted-background'
          : variant() === 'ghost' || variant() === 'icon'
            ? '[&:not(:disabled)]:hover:bg-muted-background [&:not(:disabled)]:active:bg-muted-background/50 border-0'
              : ' text-primary [&:not(:disabled)]:hover:bg-background [&:not(:disabled)]:active:bg-background/50'`,
  },
})
export class Button {
  variant = input<ButtonVariant>('primary');
}
