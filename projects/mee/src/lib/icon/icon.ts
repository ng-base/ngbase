import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconType, NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'mee-icon',
  imports: [NgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-icon [name]="name()" [size]="size()"></ng-icon>`,
  host: {
    class: 'inline-flex items-center justify-center',
  },
})
export class Icon {
  readonly name = input.required<IconType>();
  readonly size = input<string>('1rem');
}
