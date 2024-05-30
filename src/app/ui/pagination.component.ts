import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { Pagination } from '@meeui/pagination';

@Component({
  standalone: true,
  selector: 'app-pagination',
  imports: [Heading, Pagination],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="paginationPage">Pagination</h4>
    <mee-pagination [active]="2" [size]="10" [total]="500"></mee-pagination>
  `,
})
export class PaginationComponent {
  checkBox = false;
}
