import { Component } from '@angular/core';
import { Chip } from '@meeui/ui/chip';

@Component({
  selector: 'app-root',
  imports: [Chip],
  template: `<button meeChip>Chip</button>`,
})
export class AppComponent {}
