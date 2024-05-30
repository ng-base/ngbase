import { Component, OnInit } from '@angular/core';
import { List } from '@meeui/list';
import { Card } from '@meeui/card';
import { RouterLink } from '@angular/router';
import { Icons } from '@meeui/icon';

@Component({
  standalone: true,
  selector: 'app-nav',
  imports: [List, Card, RouterLink, Icons],
  template: `
    <mee-card>
      <a meeList (click)="scrollToTop()" routerLink="accordion"> Accordion</a>
      <a meeList href="#autocompletePage" disabled>Alert</a>
      <a meeList (click)="scrollToTop()" routerLink="alert-dialog">
        Alert Dialog
      </a>
      <a meeList (click)="scrollToTop()" routerLink="avatar">Avatar</a>
      <a meeList (click)="scrollToTop()" routerLink="autocomplete">
        Autocomplete
      </a>
      <a meeList (click)="scrollToTop()" routerLink="badge">Badge</a>
      <a meeList (click)="scrollToTop()" routerLink="buttons">Buttons</a>
      <a meeList (click)="scrollToTop()" routerLink="breadcrumbs">
        Breadcrumbs
      </a>
      <a meeList href="#cardPage">Card</a>
      <a meeList (click)="scrollToTop()" routerLink="color-picker">
        Color Picker
      </a>
      <a meeList (click)="scrollToTop()" routerLink="calendar">Calendar</a>
      <a meeList (click)="scrollToTop()" routerLink="carousel">Carousel</a>
      <a meeList (click)="scrollToTop()" routerLink="checkbox">Checkbox</a>
      <a meeList (click)="scrollToTop()" routerLink="chip" disabled>Chip</a>
      <a meeList (click)="scrollToTop()" routerLink="context-menu">
        Context Menu
      </a>
      <a meeList (click)="scrollToTop()" routerLink="datepicker">Datepicker</a>
      <a meeList (click)="scrollToTop()" routerLink="dialog">Dialog</a>
      <a meeList (click)="scrollToTop()" routerLink="drawer">Drawer</a>
      <a meeList (click)="scrollToTop()" routerLink="forms">Forms</a>
      <a meeList (click)="scrollToTop()" routerLink="hover-card">Hover Card</a>
      <a meeList href="#iconPage" disabled>Icon</a>
      <a meeList (click)="scrollToTop()" routerLink="input">Input</a>
      <a meeList (click)="scrollToTop()" routerLink="otp">Input OTP</a>
      <a meeList (click)="scrollToTop()" routerLink="keyboard-shortcuts">
        Keyboard Shortcuts
      </a>
      <a meeList href="#listPage">List</a>
      <a meeList (click)="scrollToTop()" routerLink="mention">Mention</a>
      <a meeList (click)="scrollToTop()" routerLink="menu">Menu</a>
      <a meeList (click)="scrollToTop()" routerLink="navigation-menu">
        Navigation Menu
      </a>
      <a meeList (click)="scrollToTop()" routerLink="pagination">Pagination</a>
      <a meeList (click)="scrollToTop()" routerLink="progress">Progress</a>
      <a meeList (click)="scrollToTop()" routerLink="popover">Popover</a>
      <a meeList (click)="scrollToTop()" routerLink="picasa" disabled>Picasa</a>
      <a meeList (click)="scrollToTop()" routerLink="radio">Radio</a>
      <a meeList (click)="scrollToTop()" routerLink="resizable">Resizable</a>
      <a meeList (click)="scrollToTop()" routerLink="scroll-area">
        Scroll Area
      </a>
      <a meeList (click)="scrollToTop()" routerLink="select">Select</a>
      <a meeList href="#separatorPage">Separator</a>
      <a meeList (click)="scrollToTop()" routerLink="sheet">Sheet</a>
      <a meeList (click)="scrollToTop()" routerLink="slider">Slider</a>
      <a meeList (click)="scrollToTop()" routerLink="sonner">Sonner</a>
      <a meeList (click)="scrollToTop()" routerLink="spinner">Spinner</a>
      <a meeList (click)="scrollToTop()" routerLink="stepper">Stepper</a>
      <a meeList (click)="scrollToTop()" routerLink="sidenav">Sidenav</a>
      <a meeList (click)="scrollToTop()" routerLink="switch">Switch</a>
      <a meeList (click)="scrollToTop()" routerLink="table">Table</a>
      <a meeList (click)="scrollToTop()" routerLink="tabs">Tabs</a>
      <a meeList (click)="scrollToTop()" routerLink="toggle">Toggle</a>
      <a meeList (click)="scrollToTop()" routerLink="toggle-group">
        Toggle Group
      </a>
      <a meeList (click)="scrollToTop()" routerLink="tooltip">Tooltip</a>
      <a meeList (click)="scrollToTop()" routerLink="tour">Tour</a>
      <a meeList (click)="scrollToTop()" routerLink="tree">Tree</a>
      <a meeList (click)="scrollToTop()" routerLink="typography">Typography</a>
    </mee-card>
  `,
  styles: ``,
})
export class NavComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
