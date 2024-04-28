import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Button } from '@meeui/button';
import { ThemeService } from '../../projects/mee/src/lib/theme/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, Button],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  themeService = inject(ThemeService);
}
