import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Heading } from '@meeui/typography';
import { Menu, MenuTrigger } from '@meeui/menu';
import { Separator } from '@meeui/separator';
import { Button } from '@meeui/button';
import { List } from '@meeui/list';
import { Icon } from '@meeui/icon';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronRight,
  lucideCross,
  lucideDelete,
  lucideMenu,
  lucidePen,
  lucideTrash2,
} from '@ng-icons/lucide';
import { Option } from '@meeui/select';
import { DocCode } from './code.component';
import { PopoverTrigger } from '@meeui/popover';

@Component({
  standalone: true,
  selector: 'app-menu',
  imports: [
    Heading,
    Menu,
    Separator,
    MenuTrigger,
    Button,
    List,
    Icon,
    Option,
    DocCode,
    PopoverTrigger,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideMenu,
      lucideCross,
      lucideDelete,
      lucidePen,
      lucideTrash2,
      lucideChevronRight,
    }),
  ],
  template: `
    <h4 meeHeader class="mb-5" id="menuPage">Menu</h4>
    <app-doc-code [tsCode]="tsCode">
      <button meeButton [meeMenuTrigger]="menuContainer11">Open menu</button>
    </app-doc-code>
    <div class="flex justify-between">
      <button meeButton [meeMenuTrigger]="animals">Open menu</button>
      <button meeButton [meeMenuTrigger]="menuContainer2" [options]="{ title: 'Header' }">
        Open menu
      </button>
      <button meeButton [meePopoverTrigger]="menuWithData" [meePopoverTriggerData]="[1, 2, 3]">
        Open menu
      </button>
    </div>

    <ng-template #menuWithData let-data>
      <!-- <button meeList *ngFor="let item of menuWithData.data">{{ item }}</button> -->
      <div>{{ data }}</div>
    </ng-template>

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
        <mee-separator vertical></mee-separator>
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
        <mee-separator vertical></mee-separator>
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
        <mee-separator vertical></mee-separator>
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

    <!-- mat menu -->
    <mee-menu #animals="meeMenu">
      <button meeList [meeMenuTrigger]="vertebrates">
        Vertebrates
        <mee-icon name="lucideChevronRight" class="ml-auto"></mee-icon>
      </button>
      <button meeList [meeMenuTrigger]="invertebrates">
        Invertebrates
        <mee-icon name="lucideChevronRight" class="ml-auto"></mee-icon>
      </button>
    </mee-menu>

    <mee-menu #vertebrates="meeMenu">
      <button meeList [meeMenuTrigger]="fish">
        Fishes
        <mee-icon name="lucideChevronRight" class="ml-auto"></mee-icon>
      </button>
      <button meeList [meeMenuTrigger]="amphibians">
        Amphibians
        <mee-icon name="lucideChevronRight" class="ml-auto"></mee-icon>
      </button>
      <button meeList [meeMenuTrigger]="reptiles">
        Reptiles
        <mee-icon name="lucideChevronRight" class="ml-auto"></mee-icon>
      </button>
      <button meeList>Birds</button>
      <button meeList>Mammals</button>
    </mee-menu>

    <mee-menu #invertebrates="meeMenu">
      <button meeList>Insects</button>
      <button meeList>Molluscs</button>
      <button meeList>Crustaceans</button>
      <button meeList>Corals</button>
      <button meeList>Arachnids</button>
      <button meeList>Velvet worms</button>
      <button meeList>Horseshoe crabs</button>
    </mee-menu>

    <mee-menu #fish="meeMenu">
      <button meeList>Baikal oilfish</button>
      <button meeList>Bala shark</button>
      <button meeList>Ballan wrasse</button>
      <button meeList>Bamboo shark</button>
      <button meeList>Banded killifish</button>
    </mee-menu>

    <mee-menu #amphibians="meeMenu">
      <button meeList>Sonoran desert toad</button>
      <button meeList>Western toad</button>
      <button meeList>Arroyo toad</button>
      <button meeList>Yosemite toad</button>
    </mee-menu>

    <mee-menu #reptiles="meeMenu">
      <button meeList>Banded Day Gecko</button>
      <button meeList>Banded Gila Monster</button>
      <button meeList>Black Tree Monitor</button>
      <button meeList>Blue Spiny Lizard</button>
      <button meeList disabled>Velociraptor</button>
    </mee-menu>
    <!-- End mat menu -->

    <mee-menu #menuContainer>
      <button meeList>Profile</button>
      <button meeList>Billing</button>
      <button meeList [meeMenuTrigger]="subMenuContainer">
        Settings
        <mee-icon name="lucideChevronRight" class="ml-auto"></mee-icon>
      </button>
      <button meeList>Keyboard shortcuts</button>
      <mee-separator></mee-separator>
      <button meeList>Team</button>
      <button meeList>New Team</button>
    </mee-menu>

    <mee-menu #subMenuContainer>
      <button meeList>Profile</button>
      <button meeList>Billing</button>
      <button meeList [meeMenuTrigger]="subSubMenuContainer">
        Settings
        <mee-icon name="lucideChevronRight" class="ml-auto"></mee-icon>
      </button>
      <button meeList>Keyboard shortcuts</button>
      <mee-separator></mee-separator>
      <button meeList>Team</button>
      <button meeList>New Team</button>
    </mee-menu>

    <mee-menu #subSubMenuContainer>
      <button meeList>Profile</button>
      <button meeList>Billing</button>
      <!-- <button meeList [meeMenuTrigger]="menuContainer2">
        Settings
        <mee-icon name="lucideChevronRight" class="ml-auto"></mee-icon>
      </button> -->
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
