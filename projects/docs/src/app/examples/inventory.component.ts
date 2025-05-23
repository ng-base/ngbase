import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@meeui/ui/badge';
import { Breadcrumb, Breadcrumbs } from '@meeui/ui/breadcrumb';
import { Button } from '@meeui/ui/button';
import { Card } from '@meeui/ui/card';
import { Icon } from '@meeui/ui/icon';
import { MeeInput } from '@meeui/ui/form-field';
import { List } from '@meeui/ui/list';
import { Menu, MenuTrigger } from '@meeui/ui/menu';
import { Progress } from '@meeui/ui/progress';
import { Selectable, SelectableItem } from '@meeui/ui/selectable';
import { Separator } from '@meeui/ui/separator';
import { TableComponents } from '@meeui/ui/table';
import { Tooltip } from '@meeui/ui/tooltip';
import { Heading } from '@meeui/ui/typography';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideCreditCard,
  lucideFile,
  lucideFilter,
  lucideHouse,
  lucideLineChart,
  lucidePackage,
  lucideShoppingCart,
  lucideUser,
  lucideUsers,
} from '@ng-icons/lucide';

@Component({
  selector: 'app-inventory',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Card,
    Separator,
    Heading,
    Button,
    Icon,
    Menu,
    MenuTrigger,
    Breadcrumbs,
    Breadcrumb,
    MeeInput,
    Progress,
    Selectable,
    SelectableItem,
    List,
    TableComponents,
    Badge,
    Tooltip,
  ],
  viewProviders: [
    provideIcons({
      lucideHouse,
      lucideShoppingCart,
      lucidePackage,
      lucideUsers,
      lucideLineChart,
      lucideUser,
      lucideFilter,
      lucideFile,
      lucideCreditCard,
      lucideChevronRight,
      lucideChevronLeft,
    }),
  ],
  template: `
    <mee-card class="flex overflow-hidden !p-0">
      <!-- Sidebar -->
      <div class="flex flex-none flex-col gap-4 border-r p-4">
        <button meeButton="ghost" meeTooltip="Dashboard" meeTooltipPosition="right" class="h-9 w-9">
          <mee-icon name="lucideHouse" size="1.2rem" />
        </button>
        <button meeButton="ghost" meeTooltip="Orders" meeTooltipPosition="right" class="h-9 w-9">
          <mee-icon name="lucideShoppingCart" size="1.2rem" />
        </button>
        <button meeButton="ghost" meeTooltip="Product" meeTooltipPosition="right" class="h-9 w-9">
          <mee-icon name="lucidePackage" size="1.2rem" />
        </button>
        <button meeButton="ghost" meeTooltip="Customers" meeTooltipPosition="right" class="h-9 w-9">
          <mee-icon name="lucideUsers" size="1.2rem" />
        </button>
        <button meeButton="ghost" meeTooltip="Analytics" meeTooltipPosition="right" class="h-9 w-9">
          <mee-icon name="lucideLineChart" size="1.2rem" />
        </button>
      </div>
      <div class="flex-1 bg-foreground p-4">
        <!-- Header -->
        <div class="flex gap-4">
          <mee-breadcrumbs>
            <mee-breadcrumb>Dashboard</mee-breadcrumb>
            <mee-breadcrumb>Orders</mee-breadcrumb>
            <mee-breadcrumb>Recent Orders</mee-breadcrumb>
          </mee-breadcrumbs>
          <div class="flex-1"></div>
          <input meeInput placeholder="Search..." class="w-[366px] bg-background" />
          <button
            meeButton="outline"
            class="rounded-full bg-background !px-2"
            [meeMenuTrigger]="userMenu"
          >
            <mee-icon name="lucideUser" size="1.2rem" />
          </button>
          <mee-menu #userMenu>
            <div class="min-w-[120px]">
              <div meeHeader class="px-2 py-1">My Account</div>
              <mee-separator class="my-1" />
              <button meeList>Settings</button>
              <button meeList>Support</button>
              <mee-separator class="my-1" />
              <button meeList>Logout</button>
            </div>
          </mee-menu>
        </div>

        <!-- Content -->
        <div class="mt-4 grid grid-cols-3 items-start gap-4">
          <div class="col-span-2 w-full">
            <div class="grid grid-cols-2 gap-4">
              <mee-card class="col-span-2 gap-2 p-8">
                <h4 meeHeader="sm" class="mb-2">Your Orders</h4>
                <p class="text-balance">
                  Introducing Our Dynamic Orders Dashboard for <br />
                  Seamless Management and Insightful Analysis.
                </p>

                <button meeButton class="flex-none" class="mt-4">Create New Order</button>
              </mee-card>
              <mee-card class="flex flex-col gap-2 p-8">
                <p class="text-muted-foreground">This Week</p>
                <h4 meeHeader="md">$1,329</h4>
                <p class="text-muted-foreground">+25% from last week</p>

                <mee-progress [value]="25" class="!h-4" />
              </mee-card>
              <mee-card class="flex flex-col gap-2 p-8">
                <p class="text-muted-foreground">This Month</p>
                <h4 meeHeader="md">$5,329</h4>
                <p class="text-muted-foreground">+10% from last month</p>

                <mee-progress [value]="10" class="!h-4" />
              </mee-card>
            </div>
            <!-- Table header -->
            <div class="mt-4">
              <div class="my-2 mt-8 flex">
                <mee-selectable class="bg-muted-foreground" [activeIndex]="0">
                  <mee-selectable-item [value]="0">Week</mee-selectable-item>
                  <mee-selectable-item [value]="1">Month</mee-selectable-item>
                  <mee-selectable-item [value]="2">Year</mee-selectable-item>
                </mee-selectable>

                <div class="ml-auto flex items-center gap-2">
                  <button
                    meeButton="outline"
                    class="small bg-background"
                    [meeMenuTrigger]="filterMenu"
                  >
                    <mee-icon class="mr-2" name="lucideFilter" />
                    Filter
                  </button>
                  <button meeButton="outline" class="small bg-background">
                    <mee-icon class="mr-2" name="lucideFile" /> Export
                  </button>
                  <mee-menu #filterMenu>
                    <div class="min-w-[120px]">
                      <div meeList meeHeader>Filter by</div>
                      <mee-separator class="my-1" />
                      <button meeList>Fulfilled</button>
                      <button meeList>Declined</button>
                      <button meeList>Refunded</button>
                    </div>
                  </mee-menu>
                </div>
              </div>
              <mee-card class="p-8">
                <h4 meeHeader="sm" class="mb-4">Orders</h4>
                <p class="mb-4 text-muted-foreground">Recent orders from your store.</p>

                <table meeTable [data]="tableData" [trackBy]="trackByFn">
                  <ng-container meeColumn="customer">
                    <th meeHead *meeHeadDef>Customer</th>
                    <td meeCell *meeCellDef="let element">
                      <div class="font-medium">{{ element.name }}</div>
                      <div class="text-muted-foreground">
                        {{ element.email }}
                      </div>
                    </td>
                  </ng-container>
                  <ng-container meeColumn="type">
                    <th meeHead *meeHeadDef>Type</th>
                    <td meeCell *meeCellDef="let element">
                      {{ element.type }}
                    </td>
                  </ng-container>
                  <ng-container meeColumn="status">
                    <th meeHead *meeHeadDef>Status</th>
                    <td meeCell *meeCellDef="let element">
                      <mee-badge>{{ element.status }}</mee-badge>
                    </td>
                  </ng-container>
                  <ng-container meeColumn="date">
                    <th meeHead *meeHeadDef>Date</th>
                    <td meeCell *meeCellDef="let element">
                      {{ element.date }}
                    </td>
                  </ng-container>
                  <ng-container meeColumn="amount">
                    <th meeHead *meeHeadDef>Amount</th>
                    <td meeCell *meeCellDef="let element">
                      {{ element.amount }}
                    </td>
                  </ng-container>
                  <tr meeHeadRow *meeHeadRowDef="displayedColumns"></tr>
                  <tr meeBodyRow *meeBodyRowDef="let row; columns: displayedColumns"></tr>
                </table>
              </mee-card>
            </div>
          </div>

          <!-- Table -->
          <mee-card class="overflow-hidden !p-0">
            <div class="flex bg-foreground p-8">
              <div>
                <h4 class="text-lg font-semibold">Order Oe31b70H</h4>
                <p class="text-muted-foreground">Date: November 23, 2023</p>
              </div>
              <div class="ml-auto flex items-center gap-2">
                <button meeButton="outline" class="h-9 w-9 bg-background">
                  <mee-icon name="lucidePackage" />
                </button>
                <button meeButton="outline" class="h-9 w-9 bg-background">
                  <mee-icon name="lucideFilter" />
                </button>
              </div>
            </div>
            <div class="p-8">
              <h4 meeHeader class="mb-3">Order Details</h4>
              <ul class="grid gap-3">
                <li class="flex items-center gap-2">
                  <div class="text-muted-foreground">Glimmer Lamps x 2</div>
                  <div class="ml-auto">$250.00</div>
                </li>
                <li class="flex items-center gap-2">
                  <div class="text-muted-foreground">Aqua Filters x 1</div>
                  <div class="ml-auto">$49.00</div>
                </li>
                <li class="flex items-center gap-2">
                  <mee-separator class="my-2" />
                </li>
                <li class="flex items-center gap-2">
                  <div class="text-muted-foreground">Subtotal</div>
                  <div class="ml-auto">$299.00</div>
                </li>
                <li class="flex items-center gap-2">
                  <div class="text-muted-foreground">Shipping</div>
                  <div class="ml-auto">$5.00</div>
                </li>
                <li class="flex items-center gap-2">
                  <div class="text-muted-foreground">Tax</div>
                  <div class="ml-auto">$25.00</div>
                </li>
                <li class="flex items-center gap-2">
                  <div class="font-semibold text-muted-foreground">Total</div>
                  <div class="ml-auto font-semibold">$329.00</div>
                </li>
              </ul>
              <mee-separator class="my-4" />
              <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <h4 meeHeader class="mb-3 !font-semibold">
                    Shipping <br />
                    Information
                  </h4>
                  <div class="text-muted-foreground">
                    <div>Liam Johnson</div>
                    <div>1234 Main St.</div>
                    <div>Anytown, CA 12345</div>
                  </div>
                </div>
                <div class="grid gap-2">
                  <h4 meeHeader class="mb-3 !font-semibold">Billing Information</h4>
                  <div class="flex flex-col text-muted-foreground">
                    <div>Same as shipping address</div>
                  </div>
                </div>
              </div>
              <mee-separator class="my-4" />
              <div>
                <h4 meeHeader class="mb-3 !font-semibold">Customer Information</h4>
                <ul class="grid gap-3">
                  <li class="flex items-center gap-2">
                    <div class="text-muted-foreground">Customer</div>
                    <div class="ml-auto">Liam Johnson</div>
                  </li>
                  <li class="flex items-center gap-2">
                    <div class="text-muted-foreground">Email</div>
                    <div class="ml-auto">liam&#64;acme.com</div>
                  </li>
                  <li class="flex items-center gap-2">
                    <div class="text-muted-foreground">Phone</div>
                    <div class="ml-auto">+1 234 567 890</div>
                  </li>
                </ul>
              </div>
              <mee-separator class="my-4" />
              <div>
                <h4 meeHeader class="mb-3 !font-semibold">Payment Information</h4>
                <ul class="grid gap-3">
                  <li class="flex items-center gap-2">
                    <div class="flex gap-1 text-muted-foreground">
                      <mee-icon name="lucideCreditCard" />
                      Visa
                    </div>
                    <div class="ml-auto">**** **** **** 4523</div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="flex items-center gap-2 border-t bg-foreground px-8 py-4">
              <div class="text-sm text-muted-foreground">Updated November 23, 2023</div>
              <div class="ml-auto flex items-center gap-2">
                <button meeButton="outline" class="small bg-background">
                  <mee-icon name="lucideChevronLeft" />
                  <span class="sr-only">Previous Order</span>
                </button>
                <button meeButton="outline" class="small bg-background">
                  <mee-icon name="lucideChevronRight" />
                  <span class="sr-only">Next Order</span>
                </button>
              </div>
            </div>
          </mee-card>
        </div>
      </div>
    </mee-card>
  `,
})
export default class InventoryComponent {
  tableData = TABLE_DATA;
  displayedColumns = ['customer', 'type', 'status', 'date', 'amount'];
  trackByFn = (index: number, item: any) => item.name;
}

// prettier-ignore
const TABLE_DATA = [
  { name: 'Liam Johnson', email: 'liam@example.com', type: 'Sale', status: 'Fulfilled', date: '2023-06-23', amount: '$250.00' },
  { name: 'Olivia Smith', email: 'olivia@example.com', type: 'Refund', status: 'Declined', date: '2023-06-24', amount: '$150.00' },
  { name: 'Noah Williams', email: 'noah@example.com', type: 'Subscription', status: 'Fulfilled', date: '2023-06-25', amount: '$350.00' },
  { name: 'Emma Brown', email: 'emma@example.com', type: 'Sale', status: 'Fulfilled', date: '2023-06-26', amount: '$450.00' },
  { name: 'Liam Johnson', email: 'liam@example.com', type: 'Sale', status: 'Fulfilled', date: '2023-06-23', amount: '$250.00' },
  { name: 'Liam Johnson', email: 'liam@example.com', type: 'Sale', status: 'Fulfilled', date: '2023-06-23', amount: '$250.00' },
  { name: 'Olivia Smith', email: 'olivia@example.com', type: 'Refund', status: 'Declined', date: '2023-06-24', amount: '$150.00' },
  { name: 'Emma Brown', email: 'emma@example.com', type: 'Sale', status: 'Fulfilled', date: '2023-06-26', amount: '$450.00' },
];
