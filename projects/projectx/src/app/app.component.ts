import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Button } from '@meeui/button';
import { ThemeService } from '@meeui/theme';
import { ScrollArea } from '@meeui/scroll-area';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Button, ScrollArea],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="fixed left-0 top-0 z-10 w-full border-b bg-foreground p-b2">
      <div class="flex h-full items-center justify-between">
        <a class="text-lg" meeButton variant="ghost" routerLink="">
          <img src="logo.png" alt="Mee UI" class="h-8" />
          <p class="ml-2">Sikkim AI</p>
        </a>
        <div>
          <a meeButton variant="ghost" routerLink="/admin">Admin</a>
          <a meeButton variant="ghost" (click)="themeService.toggle()"> Theme </a>
        </div>
      </div>
    </nav>

    <mee-scroll-area class="pt-16">
      <router-outlet></router-outlet>
    </mee-scroll-area>
  `,
})
export class AppComponent {
  themeService = inject(ThemeService);
}
