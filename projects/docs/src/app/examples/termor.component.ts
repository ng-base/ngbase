// restaurant-list.component.ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button } from '@meeui/ui/button';
import { Checkbox } from '@meeui/ui/checkbox';
import { Icon } from '@meeui/ui/icon';
import { Input } from '@meeui/ui/input';
import { Pagination } from '@meeui/ui/pagination';
import { Sidenav, SidenavHeader } from '@meeui/ui/sidenav';
import { TableComponents } from '@meeui/ui/table';
import { SelectionModel } from '@meeui/adk/collections';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpDown,
  lucideCircleUserRound,
  lucideGlobe,
  lucideRatio,
  lucideSearch,
} from '@ng-icons/lucide';

interface Restaurant {
  name: string;
  score: number;
  industry: string;
  location: string;
  hasFish: string;
  multipleLocations?: number;
}

@Component({
  selector: 'app-termor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Input, Button, Checkbox, Pagination, TableComponents, Sidenav, SidenavHeader],
  viewProviders: [
    provideIcons({
      lucideCircleUserRound,
      lucideSearch,
      lucideArrowUpDown,
      lucideGlobe,
      lucideRatio,
    }),
  ],
  template: `
    <mee-sidenav>
      <mee-sidenav-header>
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <mee-icon name="lucideCircleUserRound" />
            <span>{{ creditsLeft }}</span>
          </div>
          <span class="subtitle">Monthly credits left</span>
        </div>
      </mee-sidenav-header>

      <!-- restaurant-list.component.html -->
      <div class="container">
        <!-- Header Section -->
        <div class="header-section mat-elevation-z1">
          <!-- Search and Filter Bar -->
          <div class="flex items-center gap-b2">
            <button meeButton variant="outline" class="small gap-2">
              <mee-icon name="lucideArrowUpDown" />
              Sort
            </button>

            <button meeButton variant="outline" class="small gap-2">
              <mee-icon name="lucideGlobe" />
              Countries
            </button>

            <button meeButton variant="outline" class="small gap-2">
              <mee-icon name="lucideRatio" />
              Industry
            </button>

            <label meeLabel class="ml-auto">
              <mee-icon name="lucideSearch" />
              <input meeInput (keyup)="applyFilter($event)" placeholder="Search companies" />
            </label>
          </div>
        </div>

        <!-- Main Table -->
        <table meeTable [data]="dataSource()">
          <!-- Checkbox Column -->
          <ng-container meeRow="select">
            <th meeHead *meeHeadDef class="!px-b">
              <mee-checkbox
                (checkedChange)="masterToggle()"
                [checked]="selection.hasValue() && isAllSelected()"
                [indeterminate]="selection.hasValue() && !isAllSelected()"
              />
            </th>
            <td meeCell *meeCellDef="let row" class="!px-b">
              <mee-checkbox
                (click)="$event.stopPropagation()"
                (checkedChange)="selection.toggle(row)"
                [checked]="selection.isSelected(row)"
              />
            </td>
          </ng-container>

          <!-- Name Column -->
          <ng-container meeRow="name">
            <th meeHead *meeHeadDef mat-sort-header>Company</th>
            <td meeCell *meeCellDef="let row">
              <div class="company-cell">
                <span class="company-name">{{ row.name }}</span>
                <!-- <mat-icon>open_in_new</mat-icon> -->
              </div>
            </td>
          </ng-container>

          <!-- Score Column -->
          <ng-container meeRow="score">
            <th meeHead *meeHeadDef mat-sort-header>Score</th>
            <td meeCell *meeCellDef="let row">{{ row.score }}</td>
          </ng-container>

          <!-- Industry Column -->
          <ng-container meeRow="industry">
            <th meeHead *meeHeadDef mat-sort-header>Industry</th>
            <td meeCell *meeCellDef="let row">{{ row.industry }}</td>
          </ng-container>

          <!-- Location Column -->
          <ng-container meeRow="location">
            <th meeHead *meeHeadDef mat-sort-header>Location</th>
            <td meeCell *meeCellDef="let row">
              {{ row.location }}
              @if (row.multipleLocations) {
                <span class="location-count">
                  {{ row.multipleLocations }}
                </span>
              }
            </td>
          </ng-container>

          <!-- Has Fish Column -->
          <ng-container meeRow="hasFish">
            <th meeHead *meeHeadDef>Do they have fish on the menu?</th>
            <td meeCell *meeCellDef="let row">
              <div [class]="'fish-status ' + (row.hasFish.startsWith('Yes') ? 'yes' : 'no')">
                <!-- <mat-icon>{{ row.hasFish.startsWith('Yes') ? 'check_circle' : 'cancel' }}</mat-icon> -->
                {{ row.hasFish }}
              </div>
            </td>
          </ng-container>

          <tr meeHeadRow *meeHeadRowDef="displayedColumns"></tr>
          <tr meeBodyRow *meeBodyRowDef="let row; columns: displayedColumns"></tr>
        </table>

        <mee-pagination
          [total]="dataSource().length"
          [size]="10"
          [active]="1"
          [sizeOptions]="[5, 10, 25, 100]"
          aria-label="Select page of restaurants"
        />
      </div>
    </mee-sidenav>
  `,
})
export class TermorComponent {
  displayedColumns = ['select', 'name', 'score', 'industry', 'location', 'hasFish'];
  dataSource = signal<Restaurant[]>([]);
  selection = new SelectionModel<Restaurant>(true, []);
  creditsLeft = '250/1000';

  constructor() {
    const restaurants: Restaurant[] = [
      {
        name: 'Court 12 Kitchen',
        score: 0.81,
        industry: 'Healthcare & Wellness',
        location: 'Multiple locations',
        hasFish: 'Yes - the menu includes fish dishes',
      },
      {
        name: 'Samen uit eten in Dom',
        score: 0.79,
        industry: 'Manufacturing & Prod',
        location: 'Multiple locations',
        hasFish: 'Yes - the menu includes fish dishes',
      },
      // Add more sample data here
    ];
    this.dataSource.set(restaurants);
  }

  /** Whether all items are selected */
  isAllSelected() {
    const numSelected = this.selection.selected().length;
    const numRows = this.dataSource().length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource().forEach(row => this.selection.select(row));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.set(
      this.dataSource().filter(row =>
        row.name.toLowerCase().includes(filterValue.trim().toLowerCase()),
      ),
    );
  }
}
