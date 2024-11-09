import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from '@meeui/card';
import { List } from '@meeui/list';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [Card, List, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mee-card class="!p-b2">
      <a meeList routerLink="/colors">Colors</a>
      <a meeList routerLink="/svgviewer">Svg</a>
    </mee-card>
  `,
})
export class SidebarComponent {}
