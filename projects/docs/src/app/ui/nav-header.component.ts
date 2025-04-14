import { ChangeDetectionStrategy, Component } from '@angular/core';
import { List } from '@meeui/ui/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Accordion, AccordionGroup, AccordionHeader } from '@meeui/ui/accordion';
import { dialogPortal } from '@meeui/ui/dialog';
import { keyMap } from '@ngbase/adk/keys';
import { Command, CommandItem } from '@meeui/ui/command';
import { Tooltip } from '@meeui/ui/tooltip';

@Component({
  selector: 'app-nav',
  imports: [
    List,
    RouterLink,
    RouterLinkActive,
    Accordion,
    AccordionGroup,
    AccordionHeader,
    Tooltip,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 class="p-2 font-semibold">Getting Started</h4>
    <a meeList (click)="scrollToTop()" routerLinkActive="text-primary" routerLink="">
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

    <mee-accordion-group multiple class="mt-4 border-none">
      <mee-accordion [expanded]="true" class="border-none">
        <button meeAccordionHeader class="!px-2 font-semibold">Components</button>
        @for (item of sortComponentList; track item.name) {
          <a
            meeList
            (click)="scrollToTop()"
            routerLinkActive="text-primary"
            [routerLink]="item.link || null"
            [disabled]="item.link === ''"
            [meeTooltip]="item.name"
            [meeTooltipPosition]="'right'"
            class="text-muted"
          >
            {{ item.name }}
          </a>
        }
      </mee-accordion>
      <mee-accordion [expanded]="true">
        <button meeAccordionHeader class="!px-2 font-semibold">ADK</button>
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
    class: 'block p-4',
  },
})
export class NavComponent {
  dialog = dialogPortal();

  private adkList: { name: string; link: string }[] = [
    { name: 'Cookies', link: 'docs/cookies' },
    { name: 'JWT', link: 'docs/jwt' },
    { name: 'Auto Focus', link: 'docs/auto-focus' },
    { name: 'Focus Trap', link: 'docs/focus-trap' },
    { name: 'Copy To Clipboard', link: 'docs/copy-to-clipboard' },
    { name: 'Shortcuts', link: 'docs/shortcuts' },
    { name: 'Directionality', link: 'docs/directionality' },
    { name: 'Test', link: 'docs/test' },
    { name: 'Translation', link: 'docs/translation' },
  ];

  sortList = this.adkList.sort((a, b) => a.name.localeCompare(b.name));

  private componentList: CommandItem[] = [
    { name: 'Accordion', link: 'docs/accordion' },
    { name: 'Alert', link: '' },
    { name: 'Alert Dialog', link: 'docs/alert-dialog' },
    { name: 'Avatar', link: 'docs/avatar' },
    { name: 'Autocomplete', link: 'docs/autocomplete' },
    { name: 'Badge', link: 'docs/badge' },
    { name: 'Buttons', link: 'docs/buttons' },
    { name: 'Breadcrumbs', link: 'docs/breadcrumbs' },
    { name: 'Card', link: 'docs/card' },
    { name: 'Color Picker', link: 'docs/color-picker' },
    { name: 'Calendar', link: 'docs/calendar' },
    { name: 'Carousel', link: 'docs/carousel' },
    { name: 'Checkbox', link: 'docs/checkbox' },
    { name: 'Chip', link: 'docs/chip' },
    { name: 'Context Menu', link: 'docs/context-menu' },
    { name: 'Command', link: 'docs/command' },
    { name: 'Datepicker', link: 'docs/datepicker' },
    { name: 'Dialog', link: 'docs/dialog' },
    { name: 'Drawer', link: 'docs/drawer' },
    { name: 'Drag', link: 'docs/drag' },
    { name: 'Forms', link: 'docs/forms' },
    { name: 'Hover Card', link: 'docs/hover-card' },
    { name: 'Icon', link: '' },
    { name: 'Form Field', link: 'docs/form-field' },
    { name: 'Input OTP', link: 'docs/otp' },
    { name: 'List', link: 'docs/list' },
    { name: 'Mask', link: 'docs/mask' },
    { name: 'Mention', link: 'docs/mention' },
    { name: 'Menu', link: 'docs/menu' },
    { name: 'Navigation Menu', link: 'docs/navigation-menu' },
    { name: 'Pagination', link: 'docs/pagination' },
    { name: 'Progress', link: 'docs/progress' },
    { name: 'Popover', link: 'docs/popover' },
    { name: 'Picasa', link: 'docs/picasa' },
    { name: 'Radio', link: 'docs/radio' },
    { name: 'Resizable', link: 'docs/resizable' },
    { name: 'Scroll Area', link: 'docs/scroll-area' },
    { name: 'Select', link: 'docs/select' },
    { name: 'Selectable', link: 'docs/selectable' },
    { name: 'Separator', link: '' },
    { name: 'Sheet', link: 'docs/sheet' },
    { name: 'Slider', link: 'docs/slider' },
    { name: 'Sonner', link: 'docs/sonner' },
    { name: 'Spinner', link: 'docs/spinner' },
    { name: 'Stepper', link: 'docs/stepper' },
    { name: 'Skeleton', link: 'docs/skeleton' },
    { name: 'Sidenav', link: 'docs/sidenav' },
    { name: 'Switch', link: 'docs/switch' },
    { name: 'Table', link: 'docs/table' },
    { name: 'Tabs', link: 'docs/tabs' },
    { name: 'Toggle', link: 'docs/toggle' },
    { name: 'Toggle Group', link: 'docs/toggle-group' },
    { name: 'Tooltip', link: 'docs/tooltip' },
    { name: 'Tour', link: 'docs/tour' },
    { name: 'Tree', link: 'docs/tree' },
    { name: 'Typography', link: 'docs/typography' },
    { name: 'Inline Edit', link: 'docs/inline-edit' },
    { name: 'Virtualizer', link: 'docs/virtualizer' },
  ];

  sortComponentList = this.componentList.sort((a, b) => a.name.localeCompare(b.name));

  constructor() {
    keyMap('ctrl+k|meta+k', () => this.open());
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  open() {
    this.dialog.open(Command, {
      data: [
        { name: 'Components', items: this.sortComponentList },
        { name: 'ADK', items: this.sortList },
      ],
      header: false,
      width: '600px',
      minHeight: '400px',
      maxHeight: '500px',
    });
  }
}
