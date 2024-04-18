import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-accordion',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <p>accordion works!</p> `,
  styles: ``,
})
export class AccordionComponent {}
