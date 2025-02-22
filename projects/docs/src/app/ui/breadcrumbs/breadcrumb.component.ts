import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Breadcrumb, Breadcrumbs, BreadcrumbsSeparator } from '@meeui/ui/breadcrumb';
import { Heading } from '@meeui/ui/typography';
import { DocCode, getCode } from '../code.component';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { Icon } from '@meeui/ui/icon';

@Component({
  selector: 'app-breadcrumb',
  imports: [Heading, Breadcrumbs, Breadcrumb, BreadcrumbsSeparator, FormsModule, DocCode, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideChevronRight })],
  template: `
    <h4 meeHeader class="mb-5" id="breadcrumbPage">Breadcrumbs</h4>
    <app-doc-code [tsCode]="tsCode()" [adkCode]="adkCode()">
      <mee-breadcrumbs>
        <ng-template meeBreadcrumbsSeparator>/</ng-template>
        <mee-breadcrumb>Home</mee-breadcrumb>
        <mee-breadcrumb>Product</mee-breadcrumb>
        <mee-breadcrumb>Items</mee-breadcrumb>
      </mee-breadcrumbs>
      <br />
      <mee-breadcrumbs>
        <ng-template meeBreadcrumbsSeparator>
          <mee-icon name="lucideChevronRight"></mee-icon>
        </ng-template>
        <mee-breadcrumb>Home</mee-breadcrumb>
        <mee-breadcrumb>Product</mee-breadcrumb>
        <mee-breadcrumb>Items</mee-breadcrumb>
      </mee-breadcrumbs>
    </app-doc-code>
  `,
})
export default class BreadcrumbComponent {
  tsCode = getCode('/breadcrumbs/breadcrumbs-usage.ts');

  adkCode = getCode('/breadcrumbs/breadcrumbs-adk.ts');
}
