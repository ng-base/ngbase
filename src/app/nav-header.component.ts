import { Component, OnInit } from '@angular/core';
import { ListComponent } from '@meeui/list';
import { Card } from '@meeui/card';

@Component({
  standalone: true,
  selector: 'app-nav',
  imports: [ListComponent, Card],
  template: `
    <mee-card>
      <a meeList href="#">Dashboard</a>
      <a meeList href="#">Orders</a>
      <a meeList href="#">Product</a>
      <a meeList href="#">Customer</a>
      <a meeList href="#">Analytics</a>
    </mee-card>
  `,
  styles: ``,
})
export class NavComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
