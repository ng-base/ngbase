import { Component } from '@angular/core';
import { Avatar } from '@meeui/ui/avatar';

@Component({
  selector: 'app-root',
  template: ` <mee-avatar class="w-12" src="...your image url..." /> `,
  imports: [Avatar],
})
export class AppComponent {}
