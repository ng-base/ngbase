import { Component, signal } from '@angular/core';
import { Button } from '@meeui/ui/button';
import { Sidenav, SidenavHeader, SidenavType } from '@meeui/ui/sidenav';
import { DocCode } from './code.component';

@Component({
  selector: 'app-sidenav',
  imports: [Sidenav, SidenavHeader, Button, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="sidenavPage">Sidenav</h4>

    <app-doc-code [tsCode]="tsCode" [adkCode]="adkCode">
      <mee-sidenav
        [show]="show()"
        [mode]="mode()"
        class="min-h-64 !w-96 rounded-base border bg-foreground"
      >
        <mee-sidenav-header class="border-r" width="100px" minWidth="50px">
          <div class="p-2">This is the header</div>
        </mee-sidenav-header>
        <div class="p-2">
          <p>This is the content</p>
          <button meeButton (click)="toggle()">Toggle</button>
        </div>
      </mee-sidenav>
    </app-doc-code>
  `,
})
export default class SidenavComponent {
  show = signal(true);
  mode = signal<SidenavType>('partial');

  tsCode = `
  import { Component } from '@angular/core';
  import { Sidenav, SidenavHeader, SidenavType } from '@meeui/ui/sidenav';

  @Component({
    selector: 'app-root',
    imports: [Sidenav, SidenavHeader],
    template: \`
      <mee-sidenav [show]="show()" [mode]="mode()" class="min-h-64">
        <mee-sidenav-header class="border-r" width="100px">
          <div class="p-2">This is the header</div>
        </mee-sidenav-header>
        <div class="p-2">
          <p>This is the content</p>
          <button (click)="toggle()">Toggle</button>
        </div>
      </mee-sidenav>
    \`
  })
  export class AppComponent {
    show = signal(true);
    mode = signal<SidenavType>('side');

    toggle() {
      this.show.update(show => !show);
    }
  }
  `;

  adkCode = `
  import { ChangeDetectionStrategy, Component } from '@angular/core';
  import {
    MeeSidenav,
    MeeSidenavHeader,
    MeeSidenavHeaderContent,
    MeeSidenavHeaderTrack,
    MeeSidenavOverlay,
    provideSidenav,
    slideAnimation,
    SidenavType,
  } from '@ngbase/adk/sidenav';

  export type { SidenavType };

  @Component({
    selector: 'mee-sidenav',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideSidenav(Sidenav)],
    imports: [MeeSidenavOverlay, MeeSidenavHeaderTrack],
    template: \`
      @if (showOverlay()) {
        <div meeSidenavOverlay class="z-10 bg-black/70"></div>
      }
      <div meeSidenavHeaderTrack class="transition-[width] duration-500"></div>
      <ng-content select="mee-sidenav-header" />
      <ng-content />
    \`,
    host: {
      class: 'flex w-full overflow-hidden relative top-0 left-0 h-full',
    },
  })
  export class Sidenav extends MeeSidenav {}

  @Component({
    selector: 'mee-sidenav-header',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MeeSidenavHeaderContent],
    template: \`
      <div meeSidenavHeaderContent class="h-full overflow-auto">
        <ng-content />
      </div>
    \`,
    host: {
      class: 'block h-full bg-foreground z-10 transition-[width] duration-500',
    },
    animations: [slideAnimation('500ms cubic-bezier(0.4, 0, 0.2, 1)')],
  })
  export class SidenavHeader extends MeeSidenavHeader {}
  `;

  toggle() {
    this.show.update(show => !show);
  }
}
