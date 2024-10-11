import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { Breadcrumbs, Breadcrumb, BreadcrumbsSeparator } from '@meeui/breadcrumb';
import { FormsModule } from '@angular/forms';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-breadcrumb',
  imports: [Heading, Breadcrumbs, Breadcrumb, BreadcrumbsSeparator, FormsModule, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="breadcrumbPage">Breadcrumbs</h4>
    <app-doc-code [htmlCode]="htmlCode" [tsCode]="tsCode">
      <mee-breadcrumbs>
        <ng-template meeBreadcrumbsSeparator>/</ng-template>
        <mee-breadcrumb>Home</mee-breadcrumb>
        <mee-breadcrumb>Product</mee-breadcrumb>
        <mee-breadcrumb>Items</mee-breadcrumb>
      </mee-breadcrumbs>
    </app-doc-code>
  `,
})
export class BreadcrumbComponent {
  htmlCode = `
      <mee-breadcrumbs>
        <mee-breadcrumb>
          <a>Home</a>
        </mee-breadcrumb>
        <mee-breadcrumb>
          <a>Product</a>
        </mee-breadcrumb>
        <mee-breadcrumb>
          <a>Items</a>
        </mee-breadcrumb>
      </mee-breadcrumbs>
    `;

  tsCode = `
  import { Component } from '@angular/core';
  import { Breadcrumbs, Breadcrumb } from '@meeui/breadcrumb';

  @Component({
    standalone: true,
    selector: 'app-root',
    imports: [Breadcrumbs, Breadcrumb],
    template: \`${this.htmlCode}\`,
  })
  export class AppComponent { }
  `;
}
