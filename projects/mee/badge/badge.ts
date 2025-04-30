import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'mee-badge, [meeBadge]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold',
    '[class]': `variant() === 'default'
      ? 'bg-primary text-primary-foreground hover:bg-primary/80 border-transparent' 
      : variant() === 'secondary' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent' 
      : variant() === 'outline' ? 'text-foreground border-input bg-background hover:bg-accent border-border' 
      : variant() === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent' 
      : 'bg-muted border-transparent'`,
  },
})
export class Badge {
  readonly variant = input<'default' | 'secondary' | 'outline' | 'destructive'>('default');
}
