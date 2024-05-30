import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { Breadcrumbs, Breadcrumb } from '@meeui/breadcrumb';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-breadcrumb',
  imports: [Heading, Breadcrumbs, Breadcrumb, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="breadcrumbPage">Breadcrumbs</h4>
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
  `,
})
export class BreadcrumbComponent {}
