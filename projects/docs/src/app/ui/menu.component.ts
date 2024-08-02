import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Heading } from '@meeui/typography';
import { Menu, MenuTrigger } from '@meeui/menu';
import { Separator } from '@meeui/separator';
import { Button } from '@meeui/button';
import { List } from '@meeui/list';
import { Icons } from '@meeui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideCross, lucideDelete, lucideMenu, lucidePen, lucideTrash2 } from '@ng-icons/lucide';
import { Option } from '@meeui/select';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-menu',
  imports: [Heading, Menu, Separator, MenuTrigger, Button, List, Icons, Option, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideMenu,
      lucideCross,
      lucideDelete,
      lucidePen,
      lucideTrash2,
    }),
  ],
  template: `
    <h4 meeHeader class="mb-5" id="menuPage">Menu</h4>
    <app-doc-code [tsCode]="tsCode">
      <button meeButton [meeMenuTrigger]="menuContainer11">Open menu</button>
    </app-doc-code>
    <div class="flex justify-between">
      <button meeButton [meeMenuTrigger]="menuContainer">Open menu</button>
      <button meeButton [meeMenuTrigger]="menuContainer2" [options]="{ title: 'Header' }">
        Open menu
      </button>
      <button meeButton [meeMenuTrigger]="menuContainer1">Open menu</button>
    </div>

    <mee-menu #menuContainer1>
      <div class="flex gap-b4">
        <div>
          <h4 meeHeader="xs" class="text-muted-foreground p-b2">Document Set</h4>
          <button meeOption>
            <mee-icon name="lucideCross" class="mr-b2"></mee-icon> Document Set
          </button>
          <button meeOption>
            <mee-icon name="lucideTrash2" class="mr-b2"></mee-icon> Remove Document Set
          </button>
          <button meeOption>
            <mee-icon name="lucidePen" class="mr-b2"></mee-icon> Disable Document Set Edit
          </button>
        </div>
        <mee-separator orientation="vertical"></mee-separator>
        <div>
          <h4 meeHeader="xs" class="text-muted-foreground p-b2">Document</h4>
          <button meeOption>
            <mee-icon name="lucidePen" class="mr-b2"></mee-icon> Edit Columns
          </button>
          <button meeOption>
            <mee-icon name="lucideMenu" class="mr-b2"></mee-icon> Edit Query
          </button>
          <button meeOption><mee-icon name="lucideMenu" class="mr-b2"></mee-icon> Save View</button>
          <button meeOption>
            <mee-icon name="lucideMenu" class="mr-b2"></mee-icon> Save View as
          </button>
        </div>
        <mee-separator orientation="vertical"></mee-separator>
        <div>
          <h4 meeHeader="xs" class="text-muted-foreground p-b2">Actions</h4>
          <button meeOption><mee-icon name="lucideMenu" class="mr-b2"></mee-icon> Export</button>
          <button meeOption>
            <mee-icon name="lucideMenu" class="mr-b2"></mee-icon> Assign user
          </button>
          <button meeOption>
            <mee-icon name="lucideMenu" class="mr-b2"></mee-icon> Assign stage
          </button>
          <button meeOption>
            <mee-icon name="lucideMenu" class="mr-b2"></mee-icon> Change Priority
          </button>
          <button meeOption>
            <mee-icon name="lucideMenu" class="mr-b2"></mee-icon> Update Lookup Values
          </button>
          <button meeOption><mee-icon name="lucideMenu" class="mr-b2"></mee-icon> Rescore</button>
        </div>
        <mee-separator orientation="vertical"></mee-separator>
        <div>
          <h4 meeHeader="xs" class="text-muted-foreground p-b2">Settings</h4>
          <button meeOption>
            <mee-icon name="lucideMenu" class="mr-b2"></mee-icon> Disable Document Grouping
          </button>
          <button meeOption>
            <mee-icon name="lucideMenu" class="mr-b2"></mee-icon> Enable Training Mode
          </button>
          <button meeOption>
            <mee-icon name="lucideMenu" class="mr-b2"></mee-icon> Enable Auto Complete
          </button>
          <button meeOption>
            <mee-icon name="lucideMenu" class="mr-b2"></mee-icon> Hide Filter Pane
          </button>
          <button meeOption>
            <mee-icon name="lucideMenu" class="mr-b2"></mee-icon> Enable Document Download
          </button>
        </div>
      </div>
    </mee-menu>

    <mee-menu #menuContainer>
      <button meeList>Profile</button>
      <button meeList>Billing</button>
      <button meeList [meeMenuTrigger]="menuContainer1">Settings</button>
      <button meeList>Keyboard shortcuts</button>
      <mee-separator></mee-separator>
      <button meeList>Team</button>
      <button meeList>New Team</button>
    </mee-menu>

    <mee-menu #menuContainer11>
      <button meeList>Profile</button>
      <button meeList>Billing</button>
      <button meeList>Settings</button>
      <button meeList>Keyboard shortcuts</button>
      <mee-separator></mee-separator>
      <button meeList>Team</button>
      <button meeList>New Team</button>
    </mee-menu>

    <mee-menu #menuContainer2>
      <button meeList class="!block">
        <h4 meeHeader>Profile</h4>
        <p class="text-muted-foreground">View your profile</p>
      </button>
      <button meeList class="!block">
        <h4 meeHeader>Billing</h4>
        <p class="text-muted-foreground">Manage your billing</p>
      </button>
      <button meeList class="!block">
        <h4 meeHeader>Keyboard shortcuts</h4>
        <p class="text-muted-foreground">View keyboard shortcuts</p>
      </button>
      <button meeList class="!block">
        <h4 meeHeader>Team</h4>
        <p class="text-muted-foreground">View your team</p>
      </button>
      <button meeList class="!block">
        <h4 meeHeader>New Team</h4>
        <p class="text-muted-foreground">Create a new team</p>
      </button>
    </mee-menu>
  `,
})
export class MenuComponent {
  tsCode = `
  import { Component } from '@angular/core';
  import { Menu, MenuTrigger } from '@meeui/menu';
  import { Separator } from '@meeui/separator';
  import { List } from '@meeui/list';

  @Component({
    standalone: true,
    selector: 'app-root',
    imports: [Menu, MenuTrigger, Separator, List],
    template: \`
      <button meeButton [meeMenuTrigger]="menuContainer">Open menu</button>
      
      <mee-menu #menuContainer>
        <button meeList>Profile</button>
        <button meeList>Billing</button>
        <button meeList>Settings</button>
        <button meeList>Keyboard shortcuts</button>
        <mee-separator></mee-separator>
        <button meeList>Team</button>
        <button meeList>New Team</button>
      </mee-menu>
    \`
  })
  export class AppComponent {}
  `;
}
