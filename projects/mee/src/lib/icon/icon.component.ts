import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconType, NgIconComponent } from '@ng-icons/core';

@Component({
  standalone: true,
  selector: 'mee-icon',
  imports: [NgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-icon [name]="name()" [size]="size()"></ng-icon>`,
  host: {
    class: 'inline-flex items-center justify-center',
  },
})
export class Icons {
  name = input.required<IconType>();
  size = input<string>('1rem');
}
