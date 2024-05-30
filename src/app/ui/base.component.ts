import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Button } from '@meeui/button';
import { ThemeService } from '@meeui/theme';
import { ScrollArea } from '@meeui/scroll-area';
import { UiComponent } from './ui.component';
import { TourStep } from '@meeui/tour';
import { Avatar } from '@meeui/avatar';
import { Menu, MenuTrigger } from '@meeui/menu';
import { List } from '@meeui/list';
import { provideIcons } from '@ng-icons/core';
import { lucideMenu } from '@ng-icons/lucide';
import { Icons } from '@meeui/icon';
import { Sidenav, SidenavContent, SidenavHeader } from '@meeui/sidenav';
import { Card } from '@meeui/card';
import { NavComponent } from './nav-header.component';
import { AppService } from '../app.service';

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
    Icons,
    Sidenav,
    SidenavHeader,
    SidenavContent,
    Card,
    NavComponent,
  ],
  providers: [AppService],
  viewProviders: [provideIcons({ lucideMenu })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="h-12 w-full border-b border-border bg-foreground px-4 py-2">
      <div class="flex h-full items-center justify-between">
        <div class="text-lg">
          <button meeButton variant="ghost" (click)="toggleShow()">
            <mee-icon name="lucideMenu"></mee-icon>
          </button>
          Mee UI
        </div>
        <div class="flex h-full">
          <a
            meeButton
            variant="ghost"
            (click)="themeService.open()"
            class="tour-theme"
            meeTourStep
          >
            Theme
          </a>
          <a
            meeButton
            variant="ghost"
            (click)="themeService.toggle()"
            meeTourStep
            class="tour-mode"
          >
            mode
          </a>
          <mee-avatar
            class="h-full"
            src="https://avatars.dicebear.com/api/avataaars/1.svg"
            [meeMenuTrigger]="profileMenu"
          ></mee-avatar>
        </div>
      </div>
    </nav>

    <mee-menu #profileMenu>
      <button meeList routerLink="/ui" variant="ghost">Account</button>
      <button meeList routerLink="/ui" variant="ghost">Preference</button>
      <button meeList routerLink="/ui" variant="ghost">UI</button>
    </mee-menu>

    <mee-scroll-area>
      <mee-sidenav class="mt-2" [show]="showSideMenu()">
        <mee-sidenav-header class="w-56">
          <app-nav class="tour-nav block w-56" meeTourStep></app-nav>
        </mee-sidenav-header>
        <mee-sidenav-content class="flex-1 overflow-x-hidden px-2">
          <mee-card class="mb-2">
            <router-outlet></router-outlet>
          </mee-card>

          <!-- <mee-ui [show]="showSideMenu()"></mee-ui> -->
        </mee-sidenav-content>
      </mee-sidenav>
    </mee-scroll-area>
  `,
})
export class BaseComponent {
  themeService = inject(ThemeService);
  showSideMenu = signal(true);

  toggleShow() {
    this.showSideMenu.update((x) => !x);
  }
}
