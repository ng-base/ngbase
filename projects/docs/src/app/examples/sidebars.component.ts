import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Accordion, AccordionGroup, AccordionHeader } from '@meeui/ui/accordion';
import { Avatar } from '@meeui/ui/avatar';
import { Card } from '@meeui/ui/card';
import { Icon } from '@meeui/ui/icon';
import { List } from '@meeui/ui/list';
import { Menu, MenuTrigger } from '@meeui/ui/menu';
import { Progress } from '@meeui/ui/progress';
import { Option, Select, SelectTrigger } from '@meeui/ui/select';
import { Separator } from '@meeui/ui/separator';
import { Sidenav, SidenavHeader } from '@meeui/ui/sidenav';
import { provideIcons } from '@ng-icons/core';
import {
  lucideBadgeCheck,
  lucideBell,
  lucideBook,
  lucideBot,
  lucideChevronDown,
  lucideChevronRight,
  lucideChevronsUpDown,
  lucideCode,
  lucideCreditCard,
  lucideDatabase,
  lucideEclipse,
  lucideFrame,
  lucideLifeBuoy,
  lucideLogOut,
  lucideMap,
  lucidePieChart,
  lucideSearch,
  lucideSend,
  lucideSettings2,
  lucideSquarePlus,
  lucideSquareTerminal,
  lucideUser,
} from '@ng-icons/lucide';

@Component({
  selector: 'app-sidebars',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    Card,
    AccordionGroup,
    AccordionHeader,
    Accordion,
    Icon,
    Separator,
    Sidenav,
    SidenavHeader,
    Select,
    SelectTrigger,
    Option,
    List,
    Progress,
    NgTemplateOutlet,
    Menu,
    MenuTrigger,
    Avatar,
  ],
  viewProviders: [
    provideIcons({
      lucideSearch,
      lucideSquareTerminal,
      lucideBot,
      lucideBook,
      lucideCode,
      lucideSettings2,
      lucideChevronRight,
      lucideChevronDown,
      lucideSquarePlus,
      lucideMap,
      lucidePieChart,
      lucideFrame,
      lucideEclipse,
      lucideLifeBuoy,
      lucideSend,
      lucideDatabase,
      lucideChevronsUpDown,
      lucideUser,
      lucideBadgeCheck,
      lucideCreditCard,
      lucideBell,
      lucideLogOut,
    }),
  ],
  template: `
    <mee-card class="h-[950px] overflow-hidden !bg-background !p-0">
      <mee-sidenav>
        <mee-sidenav-header class="w-64 border-r bg-foreground">
          <div class="flex h-full w-64 flex-col">
            <mee-select placeholder="Acme corp" class="m-b2" [(ngModel)]="user">
              <div meeSelectTrigger class="flex items-center gap-1">
                <mee-icon name="lucideEclipse" class="rounded bg-text p-1 text-foreground" />
                <span>{{ user }}</span>
              </div>
              <mee-option value="Acme Corp."> Acme Corp. </mee-option>
            </mee-select>
            <mee-separator />
            <div class="p-b4">
              <p class="mb-b2 text-sm font-medium text-muted">Platform</p>
              <button meeList class="!bg-transparent !px-0 font-medium">
                <mee-icon name="lucideSearch" />
                Search
              </button>
              <ng-template #subMenu>
                <div class="ml-2 flex flex-col border-l pl-2">
                  <button meeList class="text-muted hover:bg-transparent">History</button>
                  <button meeList class="text-muted hover:bg-transparent">Starred</button>
                  <button meeList class="text-muted hover:bg-transparent">Settings</button>
                </div>
              </ng-template>
              <mee-accordion-group multiple>
                <mee-accordion #ac1="meeAccordion" class="border-none" [expanded]="true">
                  <button meeAccordionHeader class="flex items-center gap-b2 !px-0">
                    <mee-icon name="lucideSquareTerminal" />
                    Playground
                    <mee-icon
                      class="ml-auto transition-transform"
                      [class.rotate-90]="ac1.expanded()"
                      name="lucideChevronRight"
                    />
                  </button>
                  <ng-container *ngTemplateOutlet="subMenu" />
                </mee-accordion>
                <mee-accordion #ac2="meeAccordion" class="border-none">
                  <button meeAccordionHeader class="flex items-center gap-b2 !px-0">
                    <mee-icon name="lucideBot" />
                    Models
                    <mee-icon
                      class="ml-auto transition-transform"
                      [class.rotate-90]="ac2.expanded()"
                      name="lucideChevronRight"
                    />
                  </button>
                  <ng-container *ngTemplateOutlet="subMenu" />
                </mee-accordion>
                <mee-accordion #ac3="meeAccordion" class="border-none">
                  <button meeAccordionHeader class="flex items-center gap-b2 !px-0">
                    <mee-icon name="lucideBook" />
                    Documentation
                    <mee-icon
                      class="ml-auto transition-transform"
                      [class.rotate-90]="ac3.expanded()"
                      name="lucideChevronRight"
                    />
                  </button>
                  <ng-container *ngTemplateOutlet="subMenu" />
                </mee-accordion>
                <mee-accordion #ac4="meeAccordion" class="border-none">
                  <button
                    meeAccordionHeader
                    class="flex items-center gap-b2 !px-0 focus:ring-offset-2"
                  >
                    <mee-icon name="lucideCode" />
                    API
                    <mee-icon
                      class="ml-auto transition-transform"
                      [class.rotate-90]="ac4.expanded()"
                      name="lucideChevronRight"
                    />
                  </button>
                  <ng-container *ngTemplateOutlet="subMenu" />
                </mee-accordion>
                <mee-accordion #ac5="meeAccordion" class="border-none">
                  <button meeAccordionHeader class="flex items-center gap-b2 !px-0">
                    <mee-icon name="lucideSettings2" />
                    Settings
                    <mee-icon
                      class="ml-auto transition-transform"
                      [class.rotate-90]="ac5.expanded()"
                      name="lucideChevronRight"
                    />
                  </button>
                  <ng-container *ngTemplateOutlet="subMenu" />
                </mee-accordion>
              </mee-accordion-group>
            </div>
            <mee-separator />
            <div class="p-b4">
              <p class="mb-b2 text-sm font-medium text-muted">Recent Projects</p>
              <button meeList class="!px-0 text-xs font-medium hover:bg-transparent">
                <mee-icon name="lucideFrame" />
                Design Engineering
              </button>
              <button meeList class="!px-0 text-xs font-medium hover:bg-transparent">
                <mee-icon name="lucidePieChart" />
                Sales & Marketing
              </button>
              <button meeList class="!px-0 text-xs font-medium hover:bg-transparent">
                <mee-icon name="lucideMap" />
                Travel
              </button>
              <button meeList class="!px-0 text-xs font-medium text-muted hover:bg-transparent">
                <mee-icon name="lucideSquarePlus" />
                Add Project
              </button>
            </div>
            <div class="mt-auto p-b4">
              <p class="mb-b2 text-sm font-medium text-muted">Help</p>
              <button meeList class="!px-0 text-xs font-medium text-muted hover:bg-transparent">
                <mee-icon name="lucideLifeBuoy" />
                Support
              </button>
              <button meeList class="!px-0 text-xs font-medium text-muted hover:bg-transparent">
                <mee-icon name="lucideSend" />
                Feedback
              </button>
              <mee-card class="mt-b4 !p-b2">
                <div class="flex items-center justify-between text-xs">
                  <div>
                    <h4 class="font-semibold">You're running out of space</h4>
                    <p class="text-muted">79.2 GB / 100 GB used</p>
                  </div>
                  <div class="grid place-items-center rounded-base bg-muted-background p-b2">
                    <mee-icon name="lucideDatabase" size="1rem" />
                  </div>
                </div>
                <mee-progress [value]="79.2" class="mt-b2" />
              </mee-card>
            </div>
            <mee-separator />
            <div class="p-b4">
              <button
                class="flex w-full items-center gap-b2 text-left"
                [meeMenuTrigger]="userMenu"
                [options]="{ width: 'target' }"
              >
                <mee-avatar class="bg-purple-600 p-b2 text-foreground">
                  <mee-icon name="lucideUser" />
                </mee-avatar>
                <div>
                  <h4 class="font-semibold">Shadcn</h4>
                  <p class="leading-none text-muted">m&#64;example.com</p>
                </div>
                <div class="ml-auto">
                  <mee-icon name="lucideChevronsUpDown" />
                </div>
              </button>

              <mee-menu #userMenu>
                <button class="flex w-full items-center gap-b2 p-b2 text-left">
                  <mee-avatar class="bg-purple-600 p-b2 text-foreground">
                    <mee-icon name="lucideUser" />
                  </mee-avatar>
                  <div>
                    <h4 class="font-semibold">Shadcn</h4>
                    <p class="leading-none text-muted">m&#64;example.com</p>
                  </div>
                </button>
                <mee-separator class="my-b" />
                <button meeList>
                  <mee-icon name="lucideBadgeCheck" />
                  Account
                </button>
                <button meeList>
                  <mee-icon name="lucideCreditCard" />
                  Billing
                </button>
                <button meeList>
                  <mee-icon name="lucideBell" />
                  Notifications
                </button>
                <mee-separator class="my-b" />
                <button meeList>
                  <mee-icon name="lucideLogOut" />
                  Logout
                </button>
              </mee-menu>
            </div>
          </div>
        </mee-sidenav-header>
      </mee-sidenav>
    </mee-card>
  `,
})
export class SidebarsComponent {
  user = 'Acme Corp.';
}
