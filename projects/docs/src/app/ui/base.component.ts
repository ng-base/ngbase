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
import { breakpointObserver } from '@meeui/adk/layout';
import { Directionality } from '@meeui/adk/bidi';
import { provideIcons } from '@ng-icons/core';
import { lucideMenu } from '@ng-icons/lucide';
import { AppService } from '../app.service';
import { NavComponent } from './nav-header.component';

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
  ],
  providers: [AppService],
  viewProviders: [provideIcons({ lucideMenu })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="sticky top-0 z-20 w-full border-b bg-foreground px-b4 py-b2">
      <div class="flex h-full items-center justify-between">
        <div class="flex items-center gap-b2 text-lg">
          <button meeButton variant="ghost" (click)="toggleShow()" class="h-8 w-8">
            <mee-icon name="lucideMenu" />
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
          <mee-theme-button meeTourStep="theme-toggle" />
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
      <button meeList>Account</button>
      <button meeList>Preference</button>
      <button meeList>UI</button>
    </mee-menu>

    <mee-scroll-area>
      <mee-sidenav [mode]="mode()" [(show)]="show">
        <mee-sidenav-header width="250px">
          <app-nav class="tour-nav block" meeTourStep></app-nav>
        </mee-sidenav-header>
        <div class="flex-1 overflow-x-hidden">
          <div class="p-b4">
            <router-outlet />
          </div>
          <!-- <div class="flex h-full h-screen w-full items-center justify-center">
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

  readonly md = this.breakpoints.observe({ md: '(max-width: 768px)' });
  readonly mode = linkedSignal({
    source: this.md,
    computation: value => (value.get('md') ? 'over' : 'side'),
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
