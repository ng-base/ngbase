import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@meeui/badge';
import { Breadcrumb, Breadcrumbs } from '@meeui/breadcrumb';
import { Button } from '@meeui/button';
import { Card } from '@meeui/card';
import { Icons } from '@meeui/icon';
import { Input } from '@meeui/input';
import { List } from '@meeui/list';
import { Menu, MenuTrigger } from '@meeui/menu';
import { Progress } from '@meeui/progress';
import { Selectable, SelectableItem } from '@meeui/selectable';
import { Separator } from '@meeui/separator';
import { TableComponents } from '@meeui/table';
import { Tooltip } from '@meeui/tooltip';
import { Heading } from '@meeui/typography';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideCreditCard,
  lucideFile,
  lucideFilter,
  lucideHome,
  lucideLineChart,
  lucidePackage,
  lucideShoppingCart,
  lucideUser,
  lucideUsers,
} from '@ng-icons/lucide';

@Component({
  standalone: true,
  selector: 'app-inventory',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Card,
    Separator,
    Heading,
    Button,
    Icons,
    Menu,
    MenuTrigger,
    Breadcrumbs,
    Breadcrumb,
    Input,
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
      lucideHome,
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
      <div class="flex flex-none flex-col gap-b4 border-r p-b4">
        <button
          meeButton
          variant="ghost"
          meeTooltip="Dashboard"
          meeTooltipPosition="right"
          class="h-9 w-9"
        >
          <mee-icon name="lucideHome" size="1.2rem" />
        </button>
        <button
          meeButton
          variant="ghost"
          meeTooltip="Orders"
          meeTooltipPosition="right"
          class="h-9 w-9"
        >
          <mee-icon name="lucideShoppingCart" size="1.2rem" />
        </button>
        <button
          meeButton
          variant="ghost"
          meeTooltip="Product"
          meeTooltipPosition="right"
          class="h-9 w-9"
        >
          <mee-icon name="lucidePackage" size="1.2rem" />
        </button>
        <button
          meeButton
          variant="ghost"
          meeTooltip="Customers"
          meeTooltipPosition="right"
          class="h-9 w-9"
        >
          <mee-icon name="lucideUsers" size="1.2rem" />
        </button>
        <button
          meeButton
          variant="ghost"
          meeTooltip="Analytics"
          meeTooltipPosition="right"
          class="h-9 w-9"
        >
          <mee-icon name="lucideLineChart" size="1.2rem" />
        </button>
      </div>
      <div class="flex-1 bg-background p-b4">
        <!-- Header -->
        <div class="flex gap-b4">
          <mee-breadcrumbs>
            <mee-breadcrumb>Dashboard</mee-breadcrumb>
            <mee-breadcrumb>Orders</mee-breadcrumb>
            <mee-breadcrumb>Recent Orders</mee-breadcrumb>
          </mee-breadcrumbs>
          <div class="flex-1"></div>
          <input
            meeInput
            placeholder="Search..."
            class="w-[366px] bg-foreground"
          />
          <button
            meeButton
            variant="outline"
            class="rounded-full bg-foreground !px-b2"
            [meeMenuTrigger]="userMenu"
          >
            <mee-icon name="lucideUser" size="1.2rem" />
          </button>
          <mee-menu #userMenu>
            <div class="min-w-[120px]">
              <div meeHeader class="px-b2 py-b">My Account</div>
              <mee-separator />
              <button meeList>Settings</button>
              <button meeList>Support</button>
              <mee-separator />
              <button meeList>Logout</button>
            </div>
          </mee-menu>
        </div>

        <!-- Content -->
        <div class="mt-b4 grid grid-cols-3 items-start gap-b4">
          <div class="col-span-2 w-full">
            <div class="grid grid-cols-2 gap-b4">
              <mee-card class="col-span-2 gap-b2 p-b8">
                <h4 meeHeader="sm" class="mb-b2">Your Orders</h4>
                <p class="text-balance">
                  Introducing Our Dynamic Orders Dashboard for <br />
                  Seamless Management and Insightful Analysis.
                </p>

                <button meeButton class="flex-none" class="mt-b4">
                  Create New Order
                </button>
              </mee-card>
              <mee-card class="flex flex-col gap-b2 p-b8">
                <p class="text-muted">This Week</p>
                <h4 meeHeader="md">$1,329</h4>
                <p class="text-muted">+25% from last week</p>

                <mee-progress [percentage]="25" class="!h-b4" />
              </mee-card>
              <mee-card class="flex flex-col gap-b2 p-b8">
                <p class="text-muted">This Month</p>
                <h4 meeHeader="md">$5,329</h4>
                <p class="text-muted">+10% from last month</p>

                <mee-progress [percentage]="10" class="!h-b4" />
              </mee-card>
            </div>
            <!-- Table header -->
            <div class="mt-b4">
              <div class="my-b2 mt-b8 flex">
                <mee-selectable class="bg-muted">
                  <mee-selectable-item>Week</mee-selectable-item>
                  <mee-selectable-item>Month</mee-selectable-item>
                  <mee-selectable-item>Year</mee-selectable-item>
                </mee-selectable>

                <div class="ml-auto flex items-center gap-b2">
                  <button
                    meeButton
                    variant="outline"
                    class="small bg-foreground"
                    [meeMenuTrigger]="filterMenu"
                  >
                    <mee-icon class="mr-b2" name="lucideFilter" />
                    Filter
                  </button>
                  <button
                    meeButton
                    variant="outline"
                    class="small bg-foreground"
                  >
                    <mee-icon class="mr-b2" name="lucideFile" /> Export
                  </button>
                  <mee-menu #filterMenu>
                    <div class="min-w-[120px]">
                      <div meeList meeHeader>Filter by</div>
                      <mee-separator class="my-b" />
                      <button meeList>Fulfilled</button>
                      <button meeList>Declined</button>
                      <button meeList>Refunded</button>
                    </div>
                  </mee-menu>
                </div>
              </div>
              <mee-card class="p-b8">
                <h4 meeHeader="sm" class="mb-b4">Orders</h4>
                <p class="text-muted-foreground mb-b4">
                  Recent orders from your store.
                </p>

                <table meeTable [data]="tableData" [trackBy]="trackByFn">
                  <ng-container meeRow="customer">
                    <th meeHead *meeHeadDef>Customer</th>
                    <td meeCell *meeCellDef="let element">
                      <div class="font-medium">{{ element.name }}</div>
                      <div class="text-muted">
                        {{ element.email }}
                      </div>
                    </td>
                  </ng-container>
                  <ng-container meeRow="type">
                    <th meeHead *meeHeadDef>Type</th>
                    <td meeCell *meeCellDef="let element">
                      {{ element.type }}
                    </td>
                  </ng-container>
                  <ng-container meeRow="status">
                    <th meeHead *meeHeadDef>Status</th>
                    <td meeCell *meeCellDef="let element">
                      <mee-badge>{{ element.status }}</mee-badge>
                    </td>
                  </ng-container>
                  <ng-container meeRow="date">
                    <th meeHead *meeHeadDef>Date</th>
                    <td meeCell *meeCellDef="let element">
                      {{ element.date }}
                    </td>
                  </ng-container>
                  <ng-container meeRow="amount">
                    <th meeHead *meeHeadDef>Amount</th>
                    <td meeCell *meeCellDef="let element">
                      {{ element.amount }}
                    </td>
                  </ng-container>
                  <tr meeHeadRow *meeHeadRowDef></tr>
                  <tr meeBodyRow *meeBodyRowDef></tr>
                </table>
              </mee-card>
            </div>
          </div>

          <!-- Table -->
          <mee-card class="overflow-hidden !p-0">
            <div class="flex bg-background p-b8">
              <div>
                <h4 class="text-lg font-semibold">Order Oe31b70H</h4>
                <p class="text-muted">Date: November 23, 2023</p>
              </div>
              <div class="ml-auto flex items-center gap-b2">
                <button
                  meeButton
                  variant="outline"
                  class="h-9 w-9 bg-foreground"
                >
                  <mee-icon name="lucidePackage" />
                </button>
                <button
                  meeButton
                  variant="outline"
                  class="h-9 w-9 bg-foreground"
                >
                  <mee-icon name="lucideFilter" />
                </button>
              </div>
            </div>
            <div class="p-b8">
              <h4 meeHeader class="mb-3">Order Details</h4>
              <ul class="grid gap-3">
                <li class="flex items-center gap-b2">
                  <div class="text-muted">Glimmer Lamps x 2</div>
                  <div class="ml-auto">$250.00</div>
                </li>
                <li class="flex items-center gap-b2">
                  <div class="text-muted">Aqua Filters x 1</div>
                  <div class="ml-auto">$49.00</div>
                </li>
                <li class="flex items-center gap-b2">
                  <mee-separator class="my-b2" />
                </li>
                <li class="flex items-center gap-b2">
                  <div class="text-muted">Subtotal</div>
                  <div class="ml-auto">$299.00</div>
                </li>
                <li class="flex items-center gap-b2">
                  <div class="text-muted">Shipping</div>
                  <div class="ml-auto">$5.00</div>
                </li>
                <li class="flex items-center gap-b2">
                  <div class="text-muted">Tax</div>
                  <div class="ml-auto">$25.00</div>
                </li>
                <li class="flex items-center gap-b2">
                  <div class="font-semibold text-muted">Total</div>
                  <div class="ml-auto font-semibold">$329.00</div>
                </li>
              </ul>
              <mee-separator class="my-4" />
              <div class="grid grid-cols-2 gap-b4">
                <div class="grid gap-b2">
                  <h4 meeHeader class="mb-3 !font-semibold">
                    Shipping <br />
                    Information
                  </h4>
                  <div class="text-muted">
                    <div>Liam Johnson</div>
                    <div>1234 Main St.</div>
                    <div>Anytown, CA 12345</div>
                  </div>
                </div>
                <div class="grid gap-b2">
                  <h4 meeHeader class="mb-3 !font-semibold">
                    Billing Information
                  </h4>
                  <div class="flex flex-col text-muted">
                    <div>Same as shipping address</div>
                  </div>
                </div>
              </div>
              <mee-separator class="my-4" />
              <div>
                <h4 meeHeader class="mb-3 !font-semibold">
                  Customer Information
                </h4>
                <ul class="grid gap-3">
                  <li class="flex items-center gap-b2">
                    <div class="text-muted">Customer</div>
                    <div class="ml-auto">Liam Johnson</div>
                  </li>
                  <li class="flex items-center gap-b2">
                    <div class="text-muted">Email</div>
                    <div class="ml-auto">liam&#64;acme.com</div>
                  </li>
                  <li class="flex items-center gap-b2">
                    <div class="text-muted">Phone</div>
                    <div class="ml-auto">+1 234 567 890</div>
                  </li>
                </ul>
              </div>
              <mee-separator class="my-4" />
              <div>
                <h4 meeHeader class="mb-3 !font-semibold">
                  Payment Information
                </h4>
                <ul class="grid gap-3">
                  <li class="flex items-center gap-b2">
                    <div class="flex gap-b text-muted">
                      <mee-icon name="lucideCreditCard" />
                      Visa
                    </div>
                    <div class="ml-auto">**** **** **** 4523</div>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="flex items-center gap-b2 border-t bg-background px-b8 py-b4"
            >
              <div class="text-sm text-muted">Updated November 23, 2023</div>
              <div class="ml-auto flex items-center gap-b2">
                <button meeButton variant="outline" class="small bg-foreground">
                  <mee-icon name="lucideChevronLeft" />
                  <span class="sr-only">Previous Order</span>
                </button>
                <button meeButton variant="outline" class="small bg-foreground">
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
export class InventoryComponent {
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
