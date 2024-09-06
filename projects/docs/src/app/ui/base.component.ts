import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
  ],
  providers: [AppService],
  viewProviders: [provideIcons({ lucideMenu })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="fixed top-0 z-20 w-full border-b bg-foreground px-b4 py-b2">
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
          <mee-avatar
            class="h-full w-7"
            src="https://avatars.dicebear.com/api/avataaars/1.svg"
            [meeMenuTrigger]="profileMenu"
          ></mee-avatar>
        </div>
      </div>
    </nav>

    <mee-menu #profileMenu>
      <button meeList variant="ghost">Account</button>
      <button meeList variant="ghost">Preference</button>
      <button meeList variant="ghost">UI</button>
    </mee-menu>

    <mee-scroll-area>
      <mee-sidenav [show]="showSideMenu()">
        <mee-sidenav-header class="w-56">
          <app-nav class="tour-nav block w-56" meeTourStep></app-nav>
        </mee-sidenav-header>
        <div class="flex-1 overflow-x-hidden">
          <div class="p-b4">
            <router-outlet></router-outlet>
          </div>

          <!-- <mee-ui [show]="showSideMenu()"></mee-ui> -->
        </div>
      </mee-sidenav>
    </mee-scroll-area>
  `,
  host: {
    class: 'block pt-b13',
  },
})
export class BaseComponent {
  themeService = inject(ThemeService);
  showSideMenu = signal(true);

  toggleShow() {
    this.showSideMenu.update(x => !x);
  }
}
