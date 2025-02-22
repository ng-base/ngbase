import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccessibleGroup, AccessibleItem, Autofocus } from '@ngbase/adk/a11y';
import { DialogRef } from '@ngbase/adk/portal';
import { filterFunction, uniqueId } from '@ngbase/adk/utils';
import { List } from '@meeui/ui/list';

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
    <div ngbAccessibleGroup [ayId]="ayId" [isPopup]="true" class="static w-full">
      <input
        ngbAutofocus
        [(ngModel)]="filter.search"
        type="text"
        placeholder="Search for apps and commands"
        class="sticky -top-4 w-full border-b bg-foreground p-4 outline-none"
      />
      @for (group of filter.filteredList(); track group.name) {
        <h4 class="mx-4 my-2 text-sm text-gray-500">{{ group.name }}</h4>
        <div class="flex flex-col px-2">
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
    class: 'block -m-4',
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
