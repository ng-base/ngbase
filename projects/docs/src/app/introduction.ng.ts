import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '@meeui/ui/button';

@Component({
  selector: 'app-introduction',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, RouterLink],
  template: `
    <div class="flex min-h-[calc(100vh-100px)] items-center justify-center">
      <div>
        <h1 class="text-4xl font-bold">Introduction Coming Soon...</h1>
        <p class="text-muted-foreground mt-4">
          <button meeButton="outline" routerLink="/docs">Read the docs here</button>
        </p>
      </div>
    </div>
  `,
})
export default class Introduction {}
