import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { List } from '@meeui/list';
import { Card } from '@meeui/card';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icons } from '@meeui/icon';

@Component({
  standalone: true,
  selector: 'app-nav',
  imports: [List, Card, RouterLink, RouterLinkActive, Icons],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mee-card>
      <h4 class="p-b2 font-semibold">Getting Started</h4>
      <a
        meeList
        (click)="scrollToTop()"
        routerLinkActive="text-primary"
        routerLink="introduction"
        disabled
      >
        Introduction
      </a>
      <a
        meeList
        (click)="scrollToTop()"
        routerLinkActive="text-primary"
        routerLink="installation"
        disabled
      >
        Installation
      </a>
      <a
        meeList
        (click)="scrollToTop()"
        routerLinkActive="text-primary"
        routerLink="theming disabled"
        disabled
        >Theming</a
      >
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="examples">
        Examples
      </a>

      <h4 class="mt-b4 p-b2 font-semibold">Components</h4>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="accordion">
        Accordion</a
      >
      <a meeList href="#autocompletePage" disabled>Alert</a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="alert-dialog">
        Alert Dialog
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="avatar"
        >Avatar</a
      >
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="autocomplete">
        Autocomplete
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="badge"
        >Badge</a
      >
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="buttons"
        >Buttons</a
      >
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="breadcrumbs">
        Breadcrumbs
      </a>
      <a meeList href="#cardPage">Card</a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="color-picker">
        Color Picker
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="calendar"
        >Calendar</a
      >
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="carousel"
        >Carousel</a
      >
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="checkbox"
        >Checkbox</a
      >
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="chip">Chip</a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="context-menu">
        Context Menu
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="datepicker"
        >Datepicker</a
      >
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="dialog"
        >Dialog</a
      >
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="drawer"
        >Drawer</a
      >
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="drag">Drag</a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="forms"
        >Forms</a
      >
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="hover-card"
        >Hover Card</a
      >
      <a meeList href="#iconPage" disabled>Icon</a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="input"
        >Input</a
      >
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="otp"
        >Input OTP</a
      >
      <a
        meeList
        (click)="scrollToTop()"
        routerLinkActive="text-primary"
        routerLink="keyboard-shortcuts"
      >
        Keyboard Shortcuts
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="list">List</a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="mention">
        Mention
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="menu">Menu</a>
      <a
        meeList
        (click)="scrollToTop()"
        routerLinkActive="text-primary"
        routerLink="navigation-menu"
      >
        Navigation Menu
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="pagination">
        Pagination
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="progress">
        Progress
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="popover">
        Popover
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="picasa">
        Picasa
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="radio">
        Radio
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="resizable">
        Resizable
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="scroll-area">
        Scroll Area
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="select">
        Select
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="selectable">
        Selectable
      </a>
      <a meeList href="#separatorPage">Separator</a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="sheet">
        Sheet
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="slider">
        Slider
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="sonner">
        Sonner
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="spinner">
        Spinner
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="stepper">
        Stepper
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="sidenav">
        Sidenav
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="switch">
        Switch
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="table">
        Table
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="tabs">Tabs</a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="toggle"
        >Toggle</a
      >
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="toggle-group">
        Toggle Group
      </a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="tooltip"
        >Tooltip</a
      >
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="tour">Tour</a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="tree">Tree</a>
      <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="typography"
        >Typography</a
      >
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
