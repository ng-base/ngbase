import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Checkbox } from '@meeui/ui/checkbox';

@Component({
  selector: 'app-root',
  template: `<mee-checkbox [(ngModel)]="checkBox">Check the UI</mee-checkbox>`,
  imports: [Checkbox, FormsModule],
})
export class AppComponent {
  checkBox = false;
}
