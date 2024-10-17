import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { List } from '../list';
import { AccessibleGroup, AccessibleItem } from '../a11y';
import { Autofocus, filterFunction, generateId } from '../utils';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DialogRef } from '../portal';

@Component({
  standalone: true,
  selector: 'mee-command',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, List, AccessibleGroup, AccessibleItem, Autofocus, RouterLink],
  template: `
    <div meeAccessibleGroup [ayId]="ayId" [isPopup]="true" class="static w-full">
      <input
        meeAutofocus
        [(ngModel)]="filter.search"
        type="text"
        placeholder="Search for apps and commands"
        class="w-full border-b bg-foreground p-b4 outline-none"
      />
      <h4 class="mx-b4 my-b2 text-sm text-gray-500">Components</h4>
      <div class="flex flex-col px-b2">
        @for (item of filter.filteredList(); track item.name) {
          <a
            meeList
            class="w-full"
            [ayId]="ayId"
            [routerLink]="item.link || null"
            (click)="close()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{{ item.name }}</span>
          </a>
        }
      </div>
    </div>
  `,
  host: {
    class: 'block -m-b4',
  },
})
export class Command {
  private dialogRef = inject(DialogRef);
  ayId = generateId();

  private componentList: { name: string; link: string }[] = [
    { name: 'Accordion', link: '/accordion' },
    { name: 'Alert', link: '' },
    { name: 'Alert Dialog', link: '/alert-dialog' },
    { name: 'Avatar', link: '/avatar' },
    { name: 'Autocomplete', link: '/autocomplete' },
    { name: 'Badge', link: '/badge' },
    { name: 'Buttons', link: '/buttons' },
    { name: 'Breadcrumbs', link: '/breadcrumbs' },
    { name: 'Card', link: '/card' },
    { name: 'Color Picker', link: '/color-picker' },
    { name: 'Calendar', link: '/calendar' },
    { name: 'Carousel', link: '/carousel' },
    { name: 'Checkbox', link: '/checkbox' },
    { name: 'Chip', link: '/chip' },
    { name: 'Context Menu', link: '/context-menu' },
    { name: 'Command', link: '/command' },
    { name: 'Datepicker', link: '/datepicker' },
    { name: 'Dialog', link: '/dialog' },
    { name: 'Drawer', link: '/drawer' },
    { name: 'Drag', link: '/drag' },
    { name: 'Forms', link: '/forms' },
    { name: 'Hover Card', link: '/hover-card' },
    { name: 'Icon', link: '' },
    { name: 'Input', link: '/input' },
    { name: 'Input OTP', link: '/otp' },
    { name: 'List', link: '/list' },
    { name: 'Mask', link: '/mask' },
    { name: 'Mention', link: '/mention' },
    { name: 'Menu', link: '/menu' },
    { name: 'Navigation Menu', link: '/navigation-menu' },
    { name: 'Pagination', link: '/pagination' },
    { name: 'Progress', link: '/progress' },
    { name: 'Popover', link: '/popover' },
    { name: 'Picasa', link: '/picasa' },
    { name: 'Radio', link: '/radio' },
    { name: 'Resizable', link: '/resizable' },
    { name: 'Scroll Area', link: '/scroll-area' },
    { name: 'Select', link: '/select' },
    { name: 'Selectable', link: '/selectable' },
    { name: 'Separator', link: '' },
    { name: 'Sheet', link: '/sheet' },
    { name: 'Slider', link: '/slider' },
    { name: 'Sonner', link: '/sonner' },
    { name: 'Spinner', link: '/spinner' },
    { name: 'Stepper', link: '/stepper' },
    { name: 'Skeleton', link: '/skeleton' },
    { name: 'Sidenav', link: '/sidenav' },
    { name: 'Switch', link: '/switch' },
    { name: 'Table', link: '/table' },
    { name: 'Tabs', link: '/tabs' },
    { name: 'Toggle', link: '/toggle' },
    { name: 'Toggle Group', link: '/toggle-group' },
    { name: 'Tooltip', link: '/tooltip' },
    { name: 'Tour', link: '/tour' },
    { name: 'Tree', link: '/tree' },
    { name: 'Typography', link: '/typography' },
  ];

  private sortComponentList = this.componentList.sort((a, b) => a.name.localeCompare(b.name));

  readonly filter = filterFunction(this.sortComponentList, { filter: item => item.name });

  close() {
    this.dialogRef.close();
  }
}
