import { Component } from '@angular/core';
import { Breadcrumbs, Breadcrumb } from '@meeui/ui/breadcrumb';

@Component({
  selector: 'app-root',
  imports: [Breadcrumbs, Breadcrumb],
  template: `
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
export class AppComponent {}
