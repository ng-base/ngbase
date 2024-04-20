import { Component, OnInit } from '@angular/core';
import { ListComponent } from '@meeui/list';
import { Card } from '@meeui/card';

@Component({
  standalone: true,
  selector: 'app-nav',
  imports: [ListComponent, Card],
  template: `
    <mee-card>
      <a meeList href="#" disabled>Autocomplete</a>
      <a meeList href="#">Accordion</a>
      <a meeList href="#">Button</a>
      <a meeList href="#">Card</a>
      <a meeList href="#">Checkbox</a>
      <a meeList href="#">Dialog</a>
      <a meeList href="#">Heading</a>
      <a meeList href="#">List</a>
      <a meeList href="#">Progress</a>
      <a meeList href="#">Resizable</a>
      <a meeList href="#">Separator</a>
      <a meeList href="#">Slider</a>
      <a meeList href="#">Sonner</a>
      <a meeList href="#">Switch</a>
      <a meeList href="#">Tabs</a>
      <a meeList href="#">Toggle</a>
      <a meeList href="#">Toggle Group</a>
      <a meeList href="#">Tooltip</a>
    </mee-card>
  `,
  styles: ``,
})
export class NavComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
