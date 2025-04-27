import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Avatar } from '@meeui/ui/avatar';
import { Button } from '@meeui/ui/button';
import { Icon } from '@meeui/ui/icon';
import { List } from '@meeui/ui/list';
import { Menu, MenuTrigger } from '@meeui/ui/menu';
import { ScrollArea } from '@meeui/ui/scroll-area';
import { Sidenav, SidenavHeader } from '@meeui/ui/sidenav';
import { injectTheme, ThemeButton } from '@meeui/ui/theme';
import { TourStep } from '@meeui/ui/tour';
import { Heading } from '@meeui/ui/typography';
import { breakpointObserver } from '@ngbase/adk/layout';
import { Directionality } from '@ngbase/adk/bidi';
import { provideIcons } from '@ng-icons/core';
import { lucideMenu } from '@ng-icons/lucide';
import { AppService } from '../app.service';
import { NavComponent } from './nav-header.component';
import { LangButton } from './lang-button';

@Component({
  selector: 'mee-base',
  imports: [
    RouterOutlet,
    Button,
    ScrollArea,
    TourStep,
    Avatar,
    MenuTrigger,
    Menu,
    List,
    Icon,
    Sidenav,
    SidenavHeader,
    NavComponent,
    Heading,
    ThemeButton,
    LangButton,
  ],
  providers: [AppService],
  viewProviders: [provideIcons({ lucideMenu })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="sticky top-0 z-20 w-full border-b bg-background px-4 py-2">
      <div class="flex h-full items-center justify-between">
        <div class="flex items-center gap-2 text-lg">
          <button meeButton="ghost" (click)="toggleShow()" class="h-8 w-8">
            <mee-icon name="lucideMenu" />
          </button>
          <img src="/logo.svg" alt="logo" class="h-6" />
          <h4 meeHeader="xs">NgBase</h4>
        </div>
        <div class="flex h-full items-center gap-1">
          <button
            meeButton="ghost"
            (click)="themeService.open()"
            class="tour-theme"
            meeTourStep="theme-open"
          >
            Theme
          </button>
          <mee-theme-button meeTourStep="theme-toggle" />
          <app-lang />
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
      <button meeList>Account</button>
      <button meeList>Preference</button>
      <button meeList>UI</button>
    </mee-menu>

    <mee-scroll-area class="h-[calc(100vh-56px)]">
      <mee-sidenav [mode]="mode()" [(show)]="show">
        <mee-sidenav-header width="250px" minWidth="80px" class="border-r">
          <app-nav class="tour-nav block" meeTourStep></app-nav>
        </mee-sidenav-header>
        <div class="flex-1 overflow-x-hidden">
          <div class="p-4">
            <router-outlet />
          </div>
          <!-- <div class="flex h-screen w-full items-center justify-center">
            <mee-spinner />
          </div> -->
        </div>
      </mee-sidenav>
    </mee-scroll-area>
  `,
  host: {
    class: 'block',
  },
})
export class BaseComponent {
  readonly themeService = injectTheme();
  readonly dir = inject(Directionality);
  readonly sideNav = viewChild.required(Sidenav);
  readonly breakpoints = breakpointObserver();

  readonly bp = this.breakpoints.observe({ md: '(max-width: 768px)' });
  readonly mode = linkedSignal({
    source: this.bp.state,
    computation: value => (value.md ? 'over' : 'side'),
  });

  readonly show = signal(true);

  constructor() {
    if (this.breakpoints.matches('(max-width: 768px)')) {
      this.show.set(false);
    }
  }

  toggleShow() {
    this.sideNav().toggle();
  }

  toggleMode() {
    this.mode.update(mode => (mode === 'side' ? 'over' : 'side'));
  }
}
