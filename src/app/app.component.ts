import { ChangeDetectionStrategy, Component } from '@angular/core';
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
import { Tab, TabGroup } from '@meeui/tab';
import { Progress } from '@meeui/progress';
import { Resizable, ResizableGroup } from '@meeui/resizable';
import { Slider } from '@meeui/slider';
import { sonnerPortal } from '@meeui/sonner';
import { Toggle } from '@meeui/toggle';
import { ToggleGroup, ToggleItem } from '@meeui/toggle-group';
import { JsonPipe } from '@angular/common';
import { sheetPortal } from '@meeui/sheet';
import { Tooltip } from '@meeui/tooltip';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    JsonPipe,
    NavComponent,
    Button,
    Separator,
    Card,
    Checkbox,
    Heading,
    Switch,
    AccordionGroup,
    AccordionItem,
    Tab,
    TabGroup,
    Progress,
    Resizable,
    ResizableGroup,
    Slider,
    Toggle,
    ToggleGroup,
    ToggleItem,
    Tooltip,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'mee-ui';
  checkBox = false;
  switch = false;
  dialogPortal = dialogPortal();
  sonner = sonnerPortal();
  sheetPortal = sheetPortal();
  count = 0;
  percentage = 40;
  slider = 50;
  toggle = false;
  toggleGroup = ['A'];

  inc() {
    this.count++;
  }

  open() {
    this.dialogPortal.open(AddComponent, {
      width: '80vw',
      title: 'Add',
      fullWindow: true,
    });
  }

  openSheet() {
    this.sheetPortal.open(AddComponent, {
      width: '25rem',
      title: 'Add',
      fullWindow: true,
    });
  }

  addMessage() {
    this.sonner.add(
      'Event has been created',
      'Sunday, December 03, 2023 at 9:00 AM',
    );
  }

  clearMessage() {
    this.sonner.closeAll();
  }
}
