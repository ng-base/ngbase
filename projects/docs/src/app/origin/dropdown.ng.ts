import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '@meeui/ui/button';
import { Icon } from '@meeui/ui/icon';
import { List } from '@meeui/ui/list';
import { Menu, MenuTrigger } from '@meeui/ui/menu';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideEllipsis } from '@ng-icons/lucide';

@Component({
  selector: 'app-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideEllipsis, lucideChevronDown })],
  imports: [Menu, MenuTrigger, Icon, Button, List],
  template: `
    <h1 class="mb-3 text-center text-3xl font-extrabold tracking-tight md:text-4xl">Dropdown</h1>
    <div
      class="*:not-first:-ms-px *:not-first:-mt-px -m-px grid grid-cols-12 *:px-1 *:py-12 sm:*:px-8 xl:*:px-12"
    >
      <div
        class="group/item relative col-span-12 flex items-center justify-center border has-[[data-comp-loading=true]]:border-none sm:col-span-6 lg:col-span-4"
      >
        <button
          meeButton="outline"
          size="icon"
          [meeMenuTrigger]="menu1"
          [options]="{ position: 'bottom' }"
        >
          <mee-icon name="lucideEllipsis" />
        </button>

        <mee-menu #menu1="meeMenu">
          <button meeList class="w-36">Option 1</button>
          <button meeList class="w-36">Option 2</button>
          <button meeList class="w-36">Option 3</button>
          <button meeList class="w-36">Option 4</button>
        </mee-menu>
      </div>
      <div
        class="group/item relative col-span-12 flex items-center justify-center border has-[[data-comp-loading=true]]:border-none sm:col-span-6 lg:col-span-4"
      >
        <button meeButton="outline" size="icon" [meeMenuTrigger]="menu2">
          Same width of trigger
          <mee-icon name="lucideChevronDown" />
        </button>
        <mee-menu #menu2="meeMenu">
          <button meeList class="w-36">Option 1</button>
          <button meeList class="w-36">Option 2</button>
          <button meeList class="w-36">Option 3</button>
          <button meeList class="w-36">Option 4</button>
        </mee-menu>
      </div>
      <div
        class="group/item relative col-span-12 flex items-center justify-center border has-[[data-comp-loading=true]]:border-none sm:col-span-6 lg:col-span-4"
      >
        <button meeButton="outline" size="icon" [meeMenuTrigger]="menu3">
          Menu with icons
          <mee-icon name="lucideChevronDown" />
        </button>
        <mee-menu #menu3="meeMenu">
          <button meeList class="w-36">Copy</button>
          <button meeList class="w-36">Edit</button>
          <button meeList class="w-36">Group</button>
          <button meeList class="w-36">Clone</button>
        </mee-menu>
      </div>
      <div
        class="group/item relative col-span-12 flex items-center justify-center border has-[[data-comp-loading=true]]:border-none sm:col-span-6 lg:col-span-4"
      >
        <button meeButton="outline" size="icon">
          Grouped icons
          <mee-icon name="lucideChevronDown" />
        </button>
      </div>
    </div>
  `,
})
export default class DropdownComponent {}
