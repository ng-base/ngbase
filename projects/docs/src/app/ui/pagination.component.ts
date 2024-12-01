import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Pagination } from '@meeui/ui/pagination';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-pagination',
  imports: [Heading, Pagination, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="paginationPage">Pagination</h4>
    <app-doc-code [tsCode]="tsCode">
      <mee-pagination
        [active]="2"
        [size]="10"
        [total]="400"
        [showPage]="true"
        class="rounded-base border bg-foreground p-b4 shadow-sm"
      />
    </app-doc-code>
  `,
})
export class PaginationComponent {
  checkBox = false;

  tsCode = `
  import { Component } from '@angular/core';
  import { Pagination } from '@meeui/ui/pagination';

  @Component({
    selector: 'app-root',
    imports: [Pagination],
    template: \`
      <mee-pagination [active]="2" [size]="10" [total]="400" />
    \`
  })
  export class AppComponent {
    checkBox = false;
  }
  `;
}
