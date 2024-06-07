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
import { Keys } from '@meeui/keys';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, Button, ScrollArea],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [Keys],
})
export class AppComponent {
  themeService = inject(ThemeService);
  keys = inject(Keys);
  num = signal(1);

  constructor() {
    this.num.set(2);
    this.num.set(3);

    const numbers$ = toObservable(this.num);
    numbers$.subscribe((value) => {
      console.log(value);
    });

    this.num.set(4);
    this.num.set(5);

    // change the theme when the user presses ctrl+d
    this.keys.event('ctrl+d').subscribe(([active, event]) => {
      if (active) {
        event.preventDefault();
        this.themeService.toggle();
      }
    });
  }
}
