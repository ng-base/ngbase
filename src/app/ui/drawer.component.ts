import { Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { FormsModule } from '@angular/forms';
import { drawerPortal } from '@meeui/drawer';
import { AddComponent } from '../add.component';
import { Button } from '@meeui/button';

@Component({
  standalone: true,
  selector: 'app-drawer',
  imports: [FormsModule, Heading, Button],
  template: `
    <h4 meeHeader class="mb-5" id="drawerPage">Drawer</h4>
    <button meeButton (click)="open()">Open drawer</button>
  `,
})
export class DrawerComponent {
  drawerPortal = drawerPortal();

  open() {
    this.drawerPortal.open(AddComponent, {
      width: '80vw',
      title: 'Add',
      backdropColor: false,
    });
  }
}
