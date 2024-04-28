import { Component, OnInit } from '@angular/core';
import { List } from '@meeui/list';
import { Card } from '@meeui/card';

@Component({
  standalone: true,
  selector: 'app-nav',
  imports: [List, Card],
  template: `
    <mee-card>
      <a meeList href="#autocompletePage">Autocomplete</a>
      <a meeList href="#accordionPage">Accordion</a>
      <a meeList href="#buttonPage">Button</a>
      <a meeList href="#cardPage">Card</a>
      <a meeList href="#colorPickerPage">Color Picker</a>
      <a meeList href="#calendarPage">Calendar</a>
      <a meeList href="#checkboxPage">Checkbox</a>
      <a meeList href="#contextMenuPage">Context Menu</a>
      <a meeList href="#datepickerPage">Datepicker</a>
      <a meeList href="/#dialogPage">Dialog</a>
      <a meeList href="#drawerPage">Drawer</a>
      <a meeList href="#headingPage">Heading</a>
      <a meeList href="#hoverCardPage">Hover Card</a>
      <a meeList href="#inputPage">Input</a>
      <a meeList href="#listPage">List</a>
      <a meeList href="#menuPage">Menu</a>
      <a meeList href="#progressPage">Progress</a>
      <a meeList href="#popoverPage">Popover</a>
      <a meeList href="#radioPage">Radio</a>
      <a meeList href="#resizablePage">Resizable</a>
      <a meeList href="#selectPage">Select</a>
      <a meeList href="#separatorPage">Separator</a>
      <a meeList href="#sliderPage">Slider</a>
      <a meeList href="#sonnerPage">Sonner</a>
      <a meeList href="#switchPage">Switch</a>
      <a meeList href="#tabsPage">Tabs</a>
      <a meeList href="#togglePage">Toggle</a>
      <a meeList href="#toggleGroupPage">Toggle Group</a>
      <a meeList href="#tooltipPage">Tooltip</a>
    </mee-card>
  `,
  styles: ``,
})
export class NavComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
