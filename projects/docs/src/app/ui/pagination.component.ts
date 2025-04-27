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
    <app-doc-code [tsCode]="tsCode" [adkCode]="adkCode">
      <mee-pagination
        [active]="2"
        [size]="10"
        [total]="400"
        [showPage]="true"
        (valueChanged)="valueChanged($event)"
        class="rounded-lg border bg-background p-4 shadow-sm"
      />
    </app-doc-code>
  `,
})
export default class PaginationComponent {
  checkBox = false;

  tsCode = `
  import { Component } from '@angular/core';
  import { Pagination } from '@meeui/ui/pagination';

  @Component({
    selector: 'app-root',
    imports: [Pagination],
    template: \`
      <mee-pagination
        [(active)]="active"
        [size]="10"
        [total]="400"
        [sizeOptions]="[10, 20, 50, 100]"
        [showPage]="true"
        (valueChanged)="valueChanged($event)"
        class="rounded-lg border bg-background p-4 shadow-sm"
      />
    \`
  })
  export class AppComponent {
    active = signal(2);

    valueChanged(value: number) {
      console.log(value);
    }
  }
  `;

  adkCode = `
  import { Component } from '@angular/core';
  import { MeePagination, MeePaginationBtn } from '@ngbase/adk/pagination';
  import { Button } from '@meeui/ui/button';
  import { Option, Select } from '@meeui/ui/select';

  @Component({
    selector: 'mee-pagination',
    providers: [{ provide: MeePagination, useExisting: Pagination }],
    imports: [Button, Select, Option, MeePaginationBtn],
    template: \`
      <div class="flex items-center gap-2">
        <div>Rows per page</div>
        <mee-select [value]="size()" (valueChange)="sizeChanged($event)" class="w-20 !py-1.5">
          @for (size of sizeOptions(); track size) {
            <mee-option [value]="size">
              {{ size }}
            </mee-option>
          }
        </mee-select>
      </div>
      <div>Page {{ active() }} of {{ _totalSize() }}</div>
      <div class="flex items-center gap-2">
        <button meePaginationBtn="prev" meeButton="outline" class="h-8 w-8 !p-2">
          <<
        </button>
        <button meePaginationBtn="prev" jump="-1" meeButton="outline" class="h-8 w-8 !p-2">
          <
        </button>
        @if (showPage()) {
          @for (item of items(); track item) {
            <button
              meePaginationBtn="page"
              [jump]="item"
              meeButton="ghost"
              class="min-w-8 !p-2 ring-offset-foreground aria-[current=page]:bg-muted aria-[current=page]:text-primary"
            >
              {{ item }}
            </button>
          }
        }
        <button meePaginationBtn="next" jump="1" meeButton="outline" class="h-8 w-8 !p-2">
          >
        </button>
        <button meePaginationBtn="next" meeButton="outline" class="h-8 w-8 !p-2">
          >>
        </button>
      </div>
    \`,
    host: {
      class: 'flex items-center gap-2 font-semibold',
    },
  })
  export class Pagination extends MeePagination {
    readonly showPage = input<boolean>(false);
  }
  `;

  valueChanged(value: number) {
    console.log(value);
  }
}
