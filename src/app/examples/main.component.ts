import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Sidenav, SidenavContent, SidenavHeader } from '@meeui/sidenav';
import { Card } from '@meeui/card';
import { Tab, Tabs } from '@meeui/tabs';
import { PlaygroundComponent } from './playground.component';
import { MailComponent } from './mail.component';
import { MusicComponent } from './music.component';
import { FormsComponent } from './forms.component';
import { InventoryComponent } from './inventory.component';
import { SidebarsComponent } from './sidebars.component';
import { ThemeService } from '@meeui/theme';
import { provideIcons } from '@ng-icons/core';
import { lucideMoon, lucideSun } from '@ng-icons/lucide';
import { Icons } from '@meeui/icon';
import { Button } from '@meeui/button';
import { BlogsComponent } from './blogs.component';
import { Spinner } from '@meeui/spinner';
import { TermorComponent } from './termor.component';

@Component({
  standalone: true,
  selector: 'app-theme1-main',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Icons,
    Button,
    Sidenav,
    SidenavHeader,
    SidenavContent,
    Card,
    Tabs,
    Tab,
    Spinner,
    PlaygroundComponent,
    MailComponent,
    MusicComponent,
    FormsComponent,
    InventoryComponent,
    SidebarsComponent,
    BlogsComponent,
    TermorComponent,
  ],
  viewProviders: [provideIcons({ lucideSun, lucideMoon })],
  template: `
    <mee-tabs [selectedIndex]="3">
      <mee-tab label="Mail">
        @defer (on viewport) {
          <app-mail />
        } @placeholder {
          <p class="text-muted-foreground text-center">Loading...</p>
        } @loading {
          <mee-spinner />
        }
      </mee-tab>
      <mee-tab label="Playground">
        @defer (on viewport) {
          <app-playground />
        } @placeholder {
          <p class="text-muted-foreground text-center">Loading...</p>
        } @loading {
          <mee-spinner />
        }
      </mee-tab>
      <mee-tab label="Music">
        @defer (on viewport) {
          <app-music />
        } @placeholder {
          <p class="text-muted-foreground text-center">Loading...</p>
        } @loading {
          <mee-spinner />
        }
      </mee-tab>
      <mee-tab label="Forms">
        @defer (on viewport) {
          <app-forms />
        } @placeholder {
          <p class="text-muted-foreground text-center">Loading...</p>
        } @loading {
          <mee-spinner />
        }
      </mee-tab>
      <mee-tab label="Inventory">
        @defer (on viewport) {
          <app-inventory />
        } @placeholder {
          <p class="text-muted-foreground text-center">Loading...</p>
        } @loading {
          <mee-spinner />
        }
      </mee-tab>
      <mee-tab label="Sidebars">
        @defer (on viewport) {
          <app-sidebars />
        } @placeholder {
          <p class="text-muted-foreground text-center">Loading...</p>
        } @loading {
          <mee-spinner />
        }
      </mee-tab>
      <mee-tab label="Blogs">
        @defer (on viewport) {
          <app-blogs />
        } @placeholder {
          <p class="text-muted-foreground text-center">Loading...</p>
        } @loading {
          <mee-spinner />
        }
      </mee-tab>
      <mee-tab label="Termor">
        @defer (on viewport) {
          <app-termor />
        } @placeholder {
          <p class="text-muted-foreground text-center">Loading...</p>
        } @loading {
          <mee-spinner />
        }
      </mee-tab>
    </mee-tabs>
    <button
      meeButton
      variant="ghost"
      class="absolute right-0 top-0.5 h-9 w-9"
      (click)="theme.toggle()"
    >
      <mee-icon [name]="theme.mode() === 'dark' ? 'lucideMoon' : 'lucideSun'"></mee-icon>
    </button>
  `,
})
export class Theme1Component implements OnInit {
  theme = inject(ThemeService);
  constructor() {}

  ngOnInit() {}
}
