import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from '@meeui/button';
import { NavComponent } from './nav-header.component';
import { Separator } from '@meeui/separator';
import { Card } from '@meeui/card';
import { Checkbox } from '@meeui/checkbox';
import { dialogPortal } from '@meeui/dialog';
import { AddComponent } from './add.component';
import { Heading } from '@meeui/typography';
import { FormsModule } from '@angular/forms';
import { Switch } from '@meeui/switch';
import { AccordionGroup, AccordionItem } from '@meeui/accordion';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    NavComponent,
    Button,
    Separator,
    Card,
    Checkbox,
    Heading,
    Switch,
    AccordionGroup,
    AccordionItem,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'mee-ui';
  checkBox = false;
  switch = false;

  dialogPortal = dialogPortal();

  open() {
    this.dialogPortal.open(AddComponent, {
      width: '80vw',
      title: 'Add',
    });
  }
}
