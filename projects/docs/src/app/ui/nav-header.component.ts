import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { List } from '@meeui/ui/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Accordion, AccordionGroup, AccordionHeader } from '@meeui/ui/accordion';
import { dialogPortal } from '@meeui/ui/dialog';
import { keyMap } from '@meeui/adk/keys';
import { Command, CommandItem } from '@meeui/ui/command';

@Component({
  selector: 'app-nav',
  imports: [List, RouterLink, RouterLinkActive, Accordion, AccordionGroup, AccordionHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
    >
      Theming
    </a>
    <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="examples">
      Examples
    </a>
    <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="origin">
      Origin
    </a>

    <mee-accordion-group multiple class="mt-b4 border-none">
      <mee-accordion [expanded]="true" class="border-none">
        <button meeAccordionHeader class="!px-b2 font-semibold">Components</button>
        @for (item of sortComponentList; track item.name) {
          <a
            meeList
            (click)="scrollToTop()"
            routerLinkActive="text-primary"
            [routerLink]="item.link || null"
            [disabled]="item.link === ''"
            class="text-muted"
          >
            {{ item.name }}
          </a>
        }
      </mee-accordion>
      <mee-accordion [expanded]="true">
        <button meeAccordionHeader class="!px-b2 font-semibold">ADK</button>
        @for (item of sortList; track item.name) {
          <a
            meeList
            (click)="scrollToTop()"
            routerLinkActive="text-primary"
            [routerLink]="item.link"
            class="text-muted"
          >
            {{ item.name }}
          </a>
        }
      </mee-accordion>
    </mee-accordion-group>
  `,
  host: {
    class: 'block p-b4',
  },
})
export class NavComponent implements OnInit {
  dialog = dialogPortal();

  private adkList: { name: string; link: string }[] = [
    { name: 'Cookies', link: 'cookies' },
    { name: 'JWT', link: 'jwt' },
    { name: 'Auto Focus', link: 'auto-focus' },
    { name: 'Focus Trap', link: 'focus-trap' },
    { name: 'Copy To Clipboard', link: 'copy-to-clipboard' },
    { name: 'Shortcuts', link: 'shortcuts' },
    { name: 'Directionality', link: 'directionality' },
    { name: 'Test', link: 'test' },
    { name: 'Translation', link: 'translation' },
  ];

  sortList = this.adkList.sort((a, b) => a.name.localeCompare(b.name));

  private componentList: CommandItem[] = [
    { name: 'Accordion', link: 'accordion' },
    { name: 'Alert', link: '' },
    { name: 'Alert Dialog', link: 'alert-dialog' },
    { name: 'Avatar', link: 'avatar' },
    { name: 'Autocomplete', link: 'autocomplete' },
    { name: 'Badge', link: 'badge' },
    { name: 'Buttons', link: 'buttons' },
    { name: 'Breadcrumbs', link: 'breadcrumbs' },
    { name: 'Card', link: 'card' },
    { name: 'Color Picker', link: 'color-picker' },
    { name: 'Calendar', link: 'calendar' },
    { name: 'Carousel', link: 'carousel' },
    { name: 'Checkbox', link: 'checkbox' },
    { name: 'Chip', link: 'chip' },
    { name: 'Context Menu', link: 'context-menu' },
    { name: 'Command', link: 'command' },
    { name: 'Datepicker', link: 'datepicker' },
    { name: 'Dialog', link: 'dialog' },
    { name: 'Drawer', link: 'drawer' },
    { name: 'Drag', link: 'drag' },
    { name: 'Forms', link: 'forms' },
    { name: 'Hover Card', link: 'hover-card' },
    { name: 'Icon', link: '' },
    { name: 'Input', link: 'input' },
    { name: 'Input OTP', link: 'otp' },
    { name: 'List', link: 'list' },
    { name: 'Mask', link: 'mask' },
    { name: 'Mention', link: 'mention' },
    { name: 'Menu', link: 'menu' },
    { name: 'Navigation Menu', link: 'navigation-menu' },
    { name: 'Pagination', link: 'pagination' },
    { name: 'Progress', link: 'progress' },
    { name: 'Popover', link: 'popover' },
    { name: 'Picasa', link: 'picasa' },
    { name: 'Radio', link: 'radio' },
    { name: 'Resizable', link: 'resizable' },
    { name: 'Scroll Area', link: 'scroll-area' },
    { name: 'Select', link: 'select' },
    { name: 'Selectable', link: 'selectable' },
    { name: 'Separator', link: '' },
    { name: 'Sheet', link: 'sheet' },
    { name: 'Slider', link: 'slider' },
    { name: 'Sonner', link: 'sonner' },
    { name: 'Spinner', link: 'spinner' },
    { name: 'Stepper', link: 'stepper' },
    { name: 'Skeleton', link: 'skeleton' },
    { name: 'Sidenav', link: 'sidenav' },
    { name: 'Switch', link: 'switch' },
    { name: 'Table', link: 'table' },
    { name: 'Tabs', link: 'tabs' },
    { name: 'Toggle', link: 'toggle' },
    { name: 'Toggle Group', link: 'toggle-group' },
    { name: 'Tooltip', link: 'tooltip' },
    { name: 'Tour', link: 'tour' },
    { name: 'Tree', link: 'tree' },
    { name: 'Typography', link: 'typography' },
    { name: 'Inline Edit', link: 'inline-edit' },
    { name: 'Virtualizer', link: 'virtualizer' },
  ];

  sortComponentList = this.componentList.sort((a, b) => a.name.localeCompare(b.name));

  constructor() {
    keyMap('ctrl+k|meta+k', () => this.open());
  }

  ngOnInit() {}

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  open() {
    this.dialog.open(Command, {
      data: [
        { name: 'Components', items: this.sortComponentList },
        { name: 'ADK', items: this.sortList },
      ],
      header: true,
      width: '600px',
      minHeight: '400px',
      maxHeight: '500px',
    });
  }
}
