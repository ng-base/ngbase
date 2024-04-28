import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mee-drag',
  standalone: true,
  imports: [],
  template: ` <p>drag works!</p> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragComponent {}
