import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Button } from '@meeui/button';
import { ThemeService } from '@meeui/theme';
import { ScrollArea } from '@meeui/scroll-area';
import { SidebarComponent } from './sidebar.component';
import { Card } from '@meeui/card';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Button, ScrollArea, Card, SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="fixed left-0 top-0 w-full border-b  bg-foreground p-b2">
      <div class="flex h-full items-center justify-between">
        <a meeButton variant="ghost" routerLink="">
          <p>Tools</p>
        </a>
        <div>
          <a meeButton variant="ghost" (click)="themeService.toggle()"> Theme </a>
        </div>
      </div>
    </nav>

    <main class="flex pt-16">
      <app-sidebar class="block w-64"></app-sidebar>
      <mee-card class="ml-b3 flex-1">
        <mee-scroll-area class="w-full p-2">
          <router-outlet></router-outlet>
        </mee-scroll-area>
      </mee-card>
    </main>
  `,
})
export class AppComponent {
  themeService = inject(ThemeService);
}
