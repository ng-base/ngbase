import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Spinner } from '@meeui/ui/spinner';
import { Tab, Tabs } from '@meeui/ui/tabs';
import { injectTheme } from '@meeui/ui/theme';
import { provideIcons } from '@ng-icons/core';
import { lucideMoon, lucideSun } from '@ng-icons/lucide';
import { BlogsComponent } from './blogs.component';
import FormsComponent from './forms.component';
import InventoryComponent from './inventory.component';
import MailComponent from './mail.component';
import MusicComponent from './music.component';
import PlaygroundComponent from './playground.component';
import SidebarsComponent from './sidebars.component';
import { TermorComponent } from './termor.component';

export function injectParams() {
  const activatedRoute = inject(ActivatedRoute);
  const params = toSignal(activatedRoute.params);
  return params;
}

@Component({
  selector: 'app-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
    <mee-tabs [selectedIndex]="tabIndex()" (selectedIndexChange)="indexChange($event)">
      <mee-tab label="Mail" class="p-b4" [mode]="'hidden'">
        @defer (on viewport) {
          <app-mail />
        } @placeholder {
          <p class="text-muted-foreground text-center">Loading...</p>
        } @loading {
          <mee-spinner />
        }
      </mee-tab>
      <mee-tab label="Playground" class="p-b4">
        @defer (on viewport) {
          <app-playground />
        } @placeholder {
          <p class="text-muted-foreground text-center">Loading...</p>
        } @loading {
          <mee-spinner />
        }
      </mee-tab>
      <mee-tab label="Music" class="p-b4">
        @defer (on viewport) {
          <app-music />
        } @placeholder {
          <p class="text-muted-foreground text-center">Loading...</p>
        } @loading {
          <mee-spinner />
        }
      </mee-tab>
      <mee-tab label="Forms" class="p-b4">
        @defer (on viewport) {
          <app-forms />
        } @placeholder {
          <p class="text-muted-foreground text-center">Loading...</p>
        } @loading {
          <mee-spinner />
        }
      </mee-tab>
      <mee-tab label="Inventory" class="p-b4">
        @defer (on viewport) {
          <app-inventory />
        } @placeholder {
          <p class="text-muted-foreground text-center">Loading...</p>
        } @loading {
          <mee-spinner />
        }
      </mee-tab>
      <mee-tab label="Sidebars" class="p-b4">
        @defer (on viewport) {
          <app-sidebars />
        } @placeholder {
          <p class="text-muted-foreground text-center">Loading...</p>
        } @loading {
          <mee-spinner />
        }
      </mee-tab>
      <mee-tab label="Blogs" class="p-b4">
        @defer (on viewport) {
          <app-blogs />
        } @placeholder {
          <p class="text-muted-foreground text-center">Loading...</p>
        } @loading {
          <mee-spinner />
        }
      </mee-tab>
      <mee-tab label="Termor" class="p-b4">
        @defer (on viewport) {
          <app-termor />
        } @placeholder {
          <p class="text-muted-foreground text-center">Loading...</p>
        } @loading {
          <mee-spinner />
        }
      </mee-tab>
    </mee-tabs>
    <!-- <button
      meeButton="ghost"
      class="absolute right-0 top-0.5 h-9 w-9"
      (click)="theme.toggle()"
    >
      <mee-icon [name]="theme.mode() === 'dark' ? 'lucideMoon' : 'lucideSun'" />
    </button> -->
  `,
})
export class ExamplesComponent {
  theme = injectTheme();
  private params = injectParams();
  private route = inject(Router);
  tabIndex = signal(+this.params()!['id']);

  constructor() {
    effect(() => {
      this.tabIndex.set(+this.params()!['id']);
    });
  }

  indexChange(index: number) {
    this.route.navigate(['/examples', index]);
  }
}
