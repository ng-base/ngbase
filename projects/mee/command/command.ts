import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccessibleGroup, AccessibleItem } from '@meeui/ui/a11y';
import { List } from '@meeui/ui/list';
import { DialogRef } from '@meeui/ui/portal';
import { filterFunction, uniqueId } from '@meeui/ui/utils';
import { Autofocus } from '@meeui/ui/adk';

export interface CommandGroup {
  name: string;
  items: CommandItem[];
}

export interface CommandItem {
  name: string;
  link: string;
}

@Component({
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
        class="sticky -top-b4 w-full border-b bg-foreground p-b4 outline-none"
      />
      @for (group of filter.filteredList(); track group.name) {
        <h4 class="mx-b4 my-b2 text-sm text-gray-500">{{ group.name }}</h4>
        <div class="flex flex-col px-b2">
          @for (item of group.items; track item.name) {
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
      }
    </div>
  `,
  host: {
    class: 'block -m-b4',
  },
})
export class Command {
  private dialogRef = inject<DialogRef<CommandGroup[]>>(DialogRef);

  readonly ayId = uniqueId();

  readonly filter = filterFunction<CommandGroup, CommandItem>(this.dialogRef.data!, {
    filter: item => item.name,
    key: 'items',
    childrenFilter: item => item.items,
  });

  close() {
    this.dialogRef.close();
  }
}
