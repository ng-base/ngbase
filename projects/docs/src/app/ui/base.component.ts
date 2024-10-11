import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Button } from '@meeui/button';
import { ThemeService, ThemeButton } from '@meeui/theme';
import { ScrollArea } from '@meeui/scroll-area';
import { UiComponent } from './ui.component';
import { TourStep } from '@meeui/tour';
import { Avatar } from '@meeui/avatar';
import { Menu, MenuTrigger } from '@meeui/menu';
import { List } from '@meeui/list';
import { provideIcons } from '@ng-icons/core';
import { lucideMenu } from '@ng-icons/lucide';
import { Icon } from '@meeui/icon';
import { Sidenav, SidenavContent, SidenavHeader } from '@meeui/sidenav';
import { Card } from '@meeui/card';
import { NavComponent } from './nav-header.component';
import { AppService } from '../app.service';
import { Heading } from '@meeui/typography';
import { Directionality } from '@meeui/utils';
import { Switch } from '../../../../mee/src/lib/switch/switch.component';
import { Spinner } from '../../../../mee/src/lib/spinner/spinner.component';

@Component({
  selector: 'mee-base',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    Button,
    ScrollArea,
    UiComponent,
    TourStep,
    Avatar,
    MenuTrigger,
    Menu,
    List,
    Icon,
    Sidenav,
    SidenavHeader,
    SidenavContent,
    Card,
    NavComponent,
    Heading,
    ThemeButton,
    Switch,
    Spinner,
  ],
  providers: [AppService],
  viewProviders: [provideIcons({ lucideMenu })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="sticky top-0 z-20 w-full border-b bg-foreground px-b4 py-b2">
      <div class="flex h-full items-center justify-between">
        <div class="flex items-center gap-b2 text-lg">
          <button meeButton variant="ghost" (click)="toggleShow()" class="h-8 w-8">
            <mee-icon name="lucideMenu"></mee-icon>
          </button>
          <img src="/logo.svg" alt="logo" class="h-6" />
          <h4 meeHeader="xs">Mee UI</h4>
        </div>
        <div class="flex h-full items-center gap-b">
          <button
            meeButton
            variant="ghost"
            (click)="themeService.open()"
            class="tour-theme"
            meeTourStep="theme-open"
          >
            Theme
          </button>
          <mee-theme-button meeTourStep="theme-toggle"></mee-theme-button>
          <button meeButton variant="ghost" (click)="dir.toggleDirection()">
            {{ dir.isRtl() ? 'RTL' : 'LTR' }}
          </button>
          <button
            meeAvatar
            class="h-full w-7"
            src="https://avatars.dicebear.com/api/avataaars/1.svg"
            [meeMenuTrigger]="profileMenu"
          ></button>
        </div>
      </div>
    </nav>

    <mee-menu #profileMenu>
      <button meeList variant="ghost">Account</button>
      <button meeList variant="ghost">Preference</button>
      <button meeList variant="ghost">UI</button>
    </mee-menu>

    <mee-scroll-area>
      <mee-sidenav>
        <mee-sidenav-header class="w-56">
          <app-nav class="tour-nav block w-56" meeTourStep></app-nav>
        </mee-sidenav-header>
        <div class="flex-1 overflow-x-hidden">
          <div class="p-b4">
            <router-outlet></router-outlet>
          </div>
          <!-- <div class="flex h-full h-screen w-full items-center justify-center">
            <mee-spinner></mee-spinner>
          </div> -->
        </div>
      </mee-sidenav>
    </mee-scroll-area>
    <!-- <mee-ui [show]="showSideMenu()"></mee-ui> -->
  `,
  host: {
    class: 'block',
  },
})
export class BaseComponent {
  themeService = inject(ThemeService);
  dir = inject(Directionality);
  sideNav = viewChild.required(Sidenav);

  toggleShow() {
    this.sideNav().toggle();
  }
}
