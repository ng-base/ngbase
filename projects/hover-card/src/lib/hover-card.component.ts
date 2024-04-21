import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mee-hover-card',
  standalone: true,
  imports: [],
  template: `
    <p>
      hover-card works!
    </p>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HoverCardComponent {

}
