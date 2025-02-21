import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Breadcrumb, Breadcrumbs, BreadcrumbsSeparator } from '@meeui/ui/breadcrumb';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';
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
    <app-doc-code [tsCode]="tsCode" [adkCode]="adkCode">
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
  tsCode = `
  import { Component } from '@angular/core';
  import { Breadcrumbs, Breadcrumb } from '@meeui/ui/breadcrumb';

  @Component({
    selector: 'app-root',
    imports: [Breadcrumbs, Breadcrumb],
    template: \`
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
    \`,
  })
  export class AppComponent { }
  `;

  adkCode = `
  import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
  import {
    MeeBreadcrumb,
    MeeBreadcrumbLink,
    MeeBreadcrumbs,
    MeeBreadcrumbSeparator,
    MeeBreadcrumbSeparatorAria,
    provideBreadcrumb,
  } from '@ngbase/adk/breadcrumb';

  @Component({
    selector: 'mee-breadcrumbs',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [MeeBreadcrumbs],
    template: \`<ng-content />\`,
    host: {
      class: 'flex items-center gap-2',
    },
  })
  export class Breadcrumbs {}

  @Component({
    selector: 'mee-breadcrumb',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideBreadcrumb(Breadcrumb)],
    viewProviders: [provideIcons({ lucideChevronRight })],
    imports: [MeeBreadcrumbLink, MeeBreadcrumbSeparatorAria],
    template: \`
      <a class='hover:text-primary aria-[current="page"]:text-primary' meeBreadcrumbLink>
        <ng-content />
      </a>
      @if (!active()) {
        <div meeBreadcrumbSeparatorAria class="text-muted">/</div>
      }
    \`,
    host: {
      class: 'flex items-center gap-2 text-muted',
    },
  })
  export class Breadcrumb extends MeeBreadcrumb {}

  @Directive({
    selector: '[meeBreadcrumbsSeparator]',
    hostDirectives: [MeeBreadcrumbSeparator],
  })
  export class BreadcrumbsSeparator {}
  `;
}
