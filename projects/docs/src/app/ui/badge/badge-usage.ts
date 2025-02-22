import { Component } from '@angular/core';
import { Badge } from '@meeui/ui/badge';

@Component({
  selector: 'app-root',
  imports: [Badge],
  template: `
    <button meeBadge>Badge</button>
    <mee-badge>Badge</mee-badge>
  `,
})
export class AppComponent {}
